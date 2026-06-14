import { describe, expect, it } from 'vitest';
import { isRawExtension } from '~/utils/raw';

describe('util: isRawExtension', () => {
    it('should recognise common RAW extensions', () => {
        for (const name of [
            'shot.CR2', 'shot.cr3', 'shot.nef', 'shot.NRW', 'shot.arw',
            'shot.dng', 'shot.orf', 'shot.rw2', 'shot.pef', 'shot.raf',
            'shot.x3f', 'shot.3fr',
        ]) {
            expect(isRawExtension(name)).toBe(true);
        }
    });

    it('should reject non-RAW image extensions', () => {
        for (const name of [
            'shot.jpg', 'shot.jpeg', 'shot.png', 'shot.webp',
            'shot.avif', 'shot.heic', 'shot.tif', 'shot.bmp',
        ]) {
            expect(isRawExtension(name)).toBe(false);
        }
    });

    it('should reject filenames without an extension', () => {
        expect(isRawExtension('shot')).toBe(false);
        expect(isRawExtension('')).toBe(false);
    });

    it('should handle paths with dots in directory names', () => {
        expect(isRawExtension('My.Photos/IMG_0042.nef')).toBe(true);
        expect(isRawExtension('My.Photos/IMG_0042.jpg')).toBe(false);
    });
});
