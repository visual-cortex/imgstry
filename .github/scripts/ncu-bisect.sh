#!/usr/bin/env bash
# Bisection-based dependency upgrade verifier for an npm-only project.
#
# Reads a JSON map of "<package>": "<target-version>" from $1
# (the output of `npm-check-updates --jsonUpgraded`).
#
# Strategy:
#   Phase 1 (fast, lint + typecheck): apply the FULL candidate set, run
#     `npm install` + `npm run lint` + `npm run check`. If green, adopt
#     all. If red, split in halves and recurse. Singletons that fail get
#     recorded as rejected; the rest of the tree keeps adopting green
#     subsets on a rolling baseline.
#   Phase 2 (tests): run `npm run test:run` on the adopted set. If it
#     regresses, re-bisect the adopted set with the full verify pipeline
#     to isolate the offender.
#   Phase 3 (build sanity): one `npm run build` on the survivors.
#
# Per-probe cost is one verify, not one per package, so a clean 30-package
# run finishes in ~1 probe instead of ~30. Worst case for K candidates
# with F failures is roughly F + log2(K) probes.
#
# Outputs:
#   /tmp/passing.txt              "<name>=<version>" per adopted bump
#   /tmp/failing.txt              "<name>=<version>" per rejected bump
#   ${LOG_DIR}/probe-<N>-<label>.log  per-probe full output
#
# Env:
#   LOG_DIR              defaults to /tmp/bisect-logs

set -euo pipefail

INPUT_JSON="${1:?usage: ncu-bisect.sh <upgrades.json>}"
ROOT="$(git rev-parse --show-toplevel)"
LOG_DIR="${LOG_DIR:-/tmp/bisect-logs}"
mkdir -p "$LOG_DIR"
rm -f "$LOG_DIR"/probe-*.log "$LOG_DIR"/rejected-*.log

: > /tmp/passing.txt
: > /tmp/failing.txt

ORIGINAL_PKG="/tmp/bisect.pkg.original"
ORIGINAL_LOCK="/tmp/bisect.lock.original"
BASELINE_PKG="/tmp/bisect.pkg.baseline"
BASELINE_LOCK="/tmp/bisect.lock.baseline"
cp "$ROOT/package.json"      "$ORIGINAL_PKG"
cp "$ROOT/package-lock.json" "$ORIGINAL_LOCK"
cp "$ORIGINAL_PKG"  "$BASELINE_PKG"
cp "$ORIGINAL_LOCK" "$BASELINE_LOCK"

reset_baseline_to_original() {
    cp "$ORIGINAL_PKG"  "$BASELINE_PKG"
    cp "$ORIGINAL_LOCK" "$BASELINE_LOCK"
    cp "$ORIGINAL_PKG"  "$ROOT/package.json"
    cp "$ORIGINAL_LOCK" "$ROOT/package-lock.json"
}

TOTAL=$(jq 'length' "$INPUT_JSON")
PROBE_COUNT=0
START_TS=$(date +%s)

human_elapsed() {
    local secs=$(( $(date +%s) - START_TS ))
    printf '%02d:%02d' $((secs / 60)) $((secs % 60))
}

count_lines() { wc -l < "$1" 2>/dev/null | tr -d ' '; }

log() {
    printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" >&2
}

progress() {
    local adopted rejected unknown
    adopted=$(count_lines /tmp/passing.txt)
    rejected=$(count_lines /tmp/failing.txt)
    unknown=$(( TOTAL - adopted - rejected ))
    log "  ▸ probes=${PROBE_COUNT} | adopted=${adopted} | rejected=${rejected} | unknown=${unknown} | elapsed=$(human_elapsed)"
}

apply_set() {
    local set_json="$1"
    jq --argjson set "$set_json" '
        reduce ($set | to_entries[]) as $e (.;
            if (.dependencies // {})[$e.key]      then .dependencies[$e.key]     = $e.value
            elif (.devDependencies // {})[$e.key]  then .devDependencies[$e.key]  = $e.value
            elif (.peerDependencies // {})[$e.key] then .peerDependencies[$e.key] = $e.value
            else . end)
    ' "$BASELINE_PKG" > "$ROOT/package.json.tmp"
    mv "$ROOT/package.json.tmp" "$ROOT/package.json"
}

revert_to_baseline() {
    cp "$BASELINE_PKG"  "$ROOT/package.json"
    cp "$BASELINE_LOCK" "$ROOT/package-lock.json"
}

commit_baseline() {
    cp "$ROOT/package.json"      "$BASELINE_PKG"
    cp "$ROOT/package-lock.json" "$BASELINE_LOCK"
}

# VERIFY_MODE controls which checks each probe runs.
#   fast  = install + lint + check                  - used for phase-1 bisection
#   full  = install + lint + check + tests          - used for phase-2 bisection
VERIFY_MODE="${VERIFY_MODE:-fast}"

dump_probe_log() {
    local file="$1"
    log "  --- last 40 log lines ---"
    tail -n 40 "$file" >&2 || true
    log "  --- end log ---"
}

verify() {
    local label="$1"
    local log_file="$LOG_DIR/probe-$(printf '%03d' "$PROBE_COUNT")-${label}.log"

    log "  ⤷ install + lint + check $([ "$VERIFY_MODE" = "full" ] && echo "+ tests") (mode=$VERIFY_MODE, log: $log_file)"
    if ! (cd "$ROOT" && npm install --legacy-peer-deps --no-audit --no-fund --silent) > "$log_file" 2>&1; then
        log "  ✗ install failed"
        dump_probe_log "$log_file"
        return 1
    fi

    if ! (cd "$ROOT" && npm run lint --silent) >> "$log_file" 2>&1; then
        log "  ✗ lint failed"
        dump_probe_log "$log_file"
        return 1
    fi

    if ! (cd "$ROOT" && npm run check --silent) >> "$log_file" 2>&1; then
        log "  ✗ check failed"
        dump_probe_log "$log_file"
        return 1
    fi

    if [ "$VERIFY_MODE" = "fast" ]; then
        log "  ✓ verify passed (lint + check)"
        return 0
    fi

    if ! (cd "$ROOT" && npm run test:run --silent) >> "$log_file" 2>&1; then
        log "  ✗ tests failed"
        dump_probe_log "$log_file"
        return 1
    fi
    log "  ✓ verify passed (lint + check + tests)"
    return 0
}

probe() {
    local set_json="$1"
    local label="$2"

    PROBE_COUNT=$((PROBE_COUNT + 1))
    log "▶ probe #${PROBE_COUNT} (${label}, size=$(echo "$set_json" | jq 'length'))"

    apply_set "$set_json"
    if verify "$label"; then
        return 0
    fi
    revert_to_baseline
    return 1
}

record_passing_set() {
    local set_json="$1"
    echo "$set_json" | jq -r 'to_entries | map("\(.key)=\(.value)") | .[]' >> /tmp/passing.txt
}

record_failing_singleton() {
    local set_json="$1"
    local label="$2"
    echo "$set_json" | jq -r 'to_entries | map("\(.key)=\(.value)") | .[]' >> /tmp/failing.txt
    local probe_log
    probe_log="$LOG_DIR/probe-$(printf '%03d' "$PROBE_COUNT")-${label}.log"
    if [ -f "$probe_log" ]; then
        local key
        key=$(echo "$set_json" | jq -r 'keys[0]')
        cp "$probe_log" "$LOG_DIR/rejected-${key//\//__}.log"
    fi
}

bisect() {
    local set_json="$1"
    local size
    size=$(echo "$set_json" | jq 'length')

    if [ "$size" -eq 0 ]; then
        return
    fi

    local label
    label=$(echo "$set_json" | jq -r 'keys | join(",") | .[:40]' | tr '/' '_' | tr '@' '_')
    [ -z "$label" ] && label="empty"

    if probe "$set_json" "$label"; then
        record_passing_set "$set_json"
        commit_baseline
        progress
        return
    fi

    if [ "$size" -eq 1 ]; then
        record_failing_singleton "$set_json" "$label"
        progress
        return
    fi

    local half=$((size / 2))
    local left right
    left=$(echo "$set_json" | jq --argjson n "$half" 'to_entries[:$n] | from_entries')
    right=$(echo "$set_json" | jq --argjson n "$half" 'to_entries[$n:] | from_entries')

    bisect "$left"
    bisect "$right"
}

log "Starting bisection of $TOTAL candidates."

VERIFY_MODE=fast bisect "$(cat "$INPUT_JSON")"

log "Phase 1 complete. Running test verification on adopted set."

PASSING_JSON=$(jq -n '{}')
while IFS='=' read -r NAME VERSION; do
    [ -z "$NAME" ] && continue
    PASSING_JSON=$(echo "$PASSING_JSON" | jq --arg n "$NAME" --arg v "$VERSION" '.[$n] = $v')
done < /tmp/passing.txt

if [ "$(echo "$PASSING_JSON" | jq 'length')" -eq 0 ]; then
    log "No adopted candidates. Done."
    exit 0
fi

reset_baseline_to_original
apply_set "$PASSING_JSON"
PROBE_COUNT=$((PROBE_COUNT + 1))
if VERIFY_MODE=full verify "full-pass"; then
    log "Phase 2 (tests) green on combined adopted set."
else
    log "Phase 2 regression. Re-bisecting adopted set with full verify."
    revert_to_baseline
    : > /tmp/passing.txt
    VERIFY_MODE=full bisect "$PASSING_JSON"
fi

if [ -s /tmp/passing.txt ]; then
    log "Phase 3: build sanity check."
    if ! (cd "$ROOT" && npm run build --silent) > "$LOG_DIR/build.log" 2>&1; then
        log "Build failed; dropping all adopted bumps."
        cat /tmp/passing.txt >> /tmp/failing.txt
        : > /tmp/passing.txt
        revert_to_baseline
    else
        log "Build green."
    fi
fi

log "Done. adopted=$(count_lines /tmp/passing.txt) rejected=$(count_lines /tmp/failing.txt) probes=${PROBE_COUNT} elapsed=$(human_elapsed)"
