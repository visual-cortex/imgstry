// Common camera RAW extensions. Mirrors the LibRaw / dcraw recognised set.
const RAW_EXTENSIONS: ReadonlySet<string> = new Set([
    '3fr', 'arw', 'cr2', 'cr3', 'crw', 'dcr', 'dng',
    'erf', 'kdc', 'mef', 'mos', 'mrw', 'nef', 'nrw',
    'orf', 'pef', 'raf', 'raw', 'rw2', 'sr2', 'srf', 'x3f',
]);

/**
 * Returns true when the given file name has a camera RAW extension.
 * Case-insensitive. Does not inspect file contents.
 * @param filename the file name (or path) to inspect
 * @returns true when the extension is a known RAW format
 */
export const isRawExtension = (filename: string): boolean => {
    const dot = filename.lastIndexOf('.');
    if (dot < 0) {
        return false;
    }
    return RAW_EXTENSIONS.has(filename.slice(dot + 1).toLowerCase());
};
