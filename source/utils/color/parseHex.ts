import { Hex } from '~/pixel/color/spaces/hex';

const CACHE_LIMIT = 64;

/**
 * Cached RGB triplet in the u8 0..255 domain.
 */
export interface ParsedHexU8 {
    r: number
    g: number
    b: number
}

/**
 * Cached RGB triplet in the float 0..1 domain.
 */
export interface ParsedHexFloat {
    r: number
    g: number
    b: number
}

const u8Cache = new Map<string, ParsedHexU8>();
const floatCache = new Map<string, ParsedHexFloat>();

const cacheGet = <T>(cache: Map<string, T>, key: string): T | undefined =>
    cache.get(key);

const cacheSet = <T>(cache: Map<string, T>, key: string, value: T): void => {
    if (cache.size >= CACHE_LIMIT) {
        const first = cache.keys().next().value;
        if (first !== undefined) {
            cache.delete(first);
        }
    }
    cache.set(key, value);
};

/**
 * Parses a hex colour string into u8 RGB, memoising the result. Both
 * the u8 and float pipelines call this on every pixel of every render,
 * so the LRU cache keeps the Hex parse cost off the hot path.
 * @param color the hex string (e.g. "#ff0080")
 * @returns the RGB triplet in the 0..255 domain
 */
export const parseHexU8 = (color: string): ParsedHexU8 => {
    const cached = cacheGet(u8Cache, color);
    if (cached) {
        return cached;
    }
    const parsed = new Hex(color).toRgb();
    const entry: ParsedHexU8 = { r: parsed.r, g: parsed.g, b: parsed.b };
    cacheSet(u8Cache, color, entry);
    return entry;
};

/**
 * Parses a hex colour string into float RGB (0..1).
 * @param color the hex string (e.g. "#ff0080")
 * @returns the RGB triplet in the 0..1 domain
 */
export const parseHexFloat = (color: string): ParsedHexFloat => {
    const cached = cacheGet(floatCache, color);
    if (cached) {
        return cached;
    }
    const u8 = parseHexU8(color);
    const entry: ParsedHexFloat = { r: u8.r / 255, g: u8.g / 255, b: u8.b / 255 };
    cacheSet(floatCache, color, entry);
    return entry;
};
