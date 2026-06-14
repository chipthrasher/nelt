// Generic helpers with no map-specific knowledge.

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
