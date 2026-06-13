// Entry point: load the data, build the map, render it, then wire up events.

import { loadData } from './js/data.js'
import { createMap } from './js/map.js'
import { renderMap } from './js/render.js'
import { wireEvents } from './js/events.js'

async function main() {
    const { portals, colors, innerLines } = await loadData()
    const { map, lineGroup, portalGroup } = createMap()

    renderMap({
        portals,
        colors,
        innerLines,
        lineGroup,
        portalGroup,
        directoryEl: document.querySelector('#directory'),
    })

    wireEvents({ map, portals })
}

main()
