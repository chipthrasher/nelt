// Loads and normalizes the map data published from Google Sheets.

import { tsvJSON } from './utils.js'
import { MAP_TABLE, LINE_TABLE, COLOR_TABLE, validateColumns } from './schema.js'

async function fetchTSV(path) {
    const response = await fetch(path)
    if (!response.ok) {
        console.error(`Failed to fetch ${path}:`, response.status)
        return ''
    }
    return response.text()
}

// Fetch the three data tables and return them in render-ready form:
//   portals     – sparse array keyed by the original sheet row index
//                 (hidden rows are left as holes), one object per exit
//   colors      – map of political entity name -> color
//   innerLines  – array of highway segments with numeric coordinates
export async function loadData() {
    const [mapTSV, lineTSV, colorTSV] = await Promise.all([
        fetchTSV(MAP_TABLE.path),
        fetchTSV(LINE_TABLE.path),
        fetchTSV(COLOR_TABLE.path),
    ])

    // Fail loudly at parse time if the sheet's columns no longer match what the
    // app reads, rather than silently rendering a blank map.
    validateColumns(MAP_TABLE, mapTSV)
    validateColumns(LINE_TABLE, lineTSV)
    validateColumns(COLOR_TABLE, colorTSV)

    const colors = {}
    for (const row of tsvJSON(colorTSV)) {
        colors[row['Nation']] = row['Color']
    }

    const innerLines = []
    for (const row of tsvJSON(lineTSV)) {
        const x1 = parseInt(row['X Position 1']),
            z1 = parseInt(row['Z Position 1']),
            x2 = parseInt(row['X Position 2']),
            z2 = parseInt(row['Z Position 2']),
            main = parseInt(row['Main'])

        if (isNaN(x1) || isNaN(x2) || isNaN(z1) || isNaN(z2) || isNaN(main)) continue
        innerLines.push({ x1, x2, z1, z2, ID: row['ID'], main })
    }

    // Keep the original row index as each portal's id so the markup's
    // data-name values stay stable; hidden rows become array holes.
    const portals = []
    tsvJSON(mapTSV).forEach((info, index) => {
        if (info['Hide'] === '1') return
        portals[index] = info
    })

    return { portals, colors, innerLines }
}
