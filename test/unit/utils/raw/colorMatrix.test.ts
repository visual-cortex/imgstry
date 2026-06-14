import { describe, expect, it } from 'vitest';
import { cameraToSrgbFromDng } from '~/utils/raw/colorMatrix';

describe('util: cameraToSrgbFromDng', () => {
    it('should return null when fewer than 9 entries are provided', () => {
        expect(cameraToSrgbFromDng([])).toBeNull();
        expect(cameraToSrgbFromDng([1, 0, 0, 0, 1, 0, 0, 0])).toBeNull();
    });

    it('should return null for a singular matrix', () => {
        // All rows identical -> singular.
        expect(cameraToSrgbFromDng([
            1, 1, 1,
            1, 1, 1,
            1, 1, 1,
        ])).toBeNull();
    });

    it('should map a neutral camera pixel to a neutral sRGB pixel', () => {
        // A plausible-shaped ColorMatrix1 (Sony A7-ish, XYZ -> camera).
        const m = cameraToSrgbFromDng([
            0.69, -0.21, -0.12,
            -0.51,  1.45,  0.08,
            -0.04,  0.18,  0.79,
        ]);
        expect(m).not.toBeNull();
        // M * [1,1,1]^T should be [1,1,1] within tolerance after the
        // row-normalisation step.
        const r = m![0] + m![1] + m![2];
        const g = m![3] + m![4] + m![5];
        const b = m![6] + m![7] + m![8];
        expect(r).toBeCloseTo(1, 6);
        expect(g).toBeCloseTo(1, 6);
        expect(b).toBeCloseTo(1, 6);
    });

    it('should produce a non-identity matrix for non-identity input', () => {
        const m = cameraToSrgbFromDng([
            0.7, -0.2, -0.1,
            -0.5,  1.4,  0.1,
            -0.05, 0.2,  0.85,
        ]);
        // Off-diagonal entries should be non-zero (mixing channels).
        expect(Math.abs(m![1])).toBeGreaterThan(0);
        expect(Math.abs(m![3])).toBeGreaterThan(0);
    });
});
