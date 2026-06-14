// Entry point

import { loadData } from './js/data.js'
import { createMap } from './js/map.js'
import { renderMap } from './js/render.js'
import { wireEvents } from './js/events.js'
import { loadConfig, setMapSize, showVersion, showLastUpdated } from './js/utils.js'

async function main() {
    const [{ portals, colors, innerLines }, config] = await Promise.all([loadData(), loadConfig()])

    // Apply the published map size before building the map, which reads it.
    setMapSize(config.mapSize)

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
    showVersion(config.version)
    showLastUpdated(config.lastUpdated)
}

main()
