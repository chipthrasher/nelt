// Shared constants, generic helpers, and the data-schema definitions for the
// Nelt map.

// --- Constants ---------------------------------------------------------------

// Distance between the world border and (0, 0) in the Nether.
// TODO: Rather than hardcoding this it would be nice to automatically
// calculate it from the dynmap endpoints.
export const MAP_SIZE_MULTIPLIER = 687.5

// Duration (ms) of the directory slide / map pan animations.
export const ANIM_LEN = 200

// --- Generic helpers (no map-specific knowledge) -----------------------------

// Return the column names from a TSV string's first (header) row.
export function tsvHeaders(tsv) {
    return tsv.replace(/\r/g, '').split('\n')[0].split('\t')
}

// Parse a tab-separated string (first row is the header) into an array of
// objects keyed by column name.
export function tsvJSON(tsv) {
    const lines = tsv.replace(/\r/g, '').split('\n')
    const headers = lines.shift().split('\t')
    return lines.map(line => {
        const data = line.split('\t')
        return headers.reduce((obj, nextKey, index) => {
            obj[nextKey] = data[index]
            return obj
        }, {})
    })
}

// --- Data schema -------------------------------------------------------------

// The expected shape of the data published from the Google Sheet.
//
// Each table lists the columns the app actually reads. Column names mirror the
// sheet headers; this file is the single source of truth for them. If a column
// is renamed/removed in the sheet (or the data fails to load), validateColumns
// throws at parse time with a clear message — instead of the app silently
// rendering a blank map.
//
// Extra columns in the sheet (e.g. "Notes" in lines, "Extra Column" in colors)
// are ignored on purpose: adding a column never breaks the app, only renaming or
// removing a required one does.

export const MAP_TABLE = {
    path: 'data/map.tsv',
    columns: ['Name', 'X', 'Z', 'X Connector', 'Z Connector', 'Inner Line',
        'Political Entity', 'National', 'IBWH', 'End', 'Hide', 'Warning',
        'Description', 'Wiki URL'],
}

export const LINE_TABLE = {
    path: 'data/lines.tsv',
    columns: ['X Position 1', 'Z Position 1', 'X Position 2', 'Z Position 2', 'ID', 'Main'],
}

export const COLOR_TABLE = {
    path: 'data/colors.tsv',
    columns: ['Nation', 'Color'],
}

// Throw if the TSV header is missing any column the app relies on. A table with
// a valid header but zero data rows is fine; an empty/failed fetch has no header
// and so fails here with a descriptive message.
export function validateColumns({ path, columns }, tsv) {
    const present = new Set(tsvHeaders(tsv))
    const missing = columns.filter(col => !present.has(col))
    if (missing.length) {
        const found = [...present].filter(Boolean)
        throw new Error(
            `${path}: missing expected column(s) ${missing.map(c => `"${c}"`).join(', ')}. ` +
            `Found: ${found.length ? found.map(c => `"${c}"`).join(', ') : '(no header — did the data fail to load?)'}. ` +
            `A sheet column may have been renamed or removed.`
        )
    }
}
