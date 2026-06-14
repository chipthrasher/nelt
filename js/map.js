// Creates the Leaflet map, its image/SVG overlays, and the coordinate control.

import { MAP_SIZE_MULTIPLIER as M } from './utils.js'

export function createMap() {
    const map = L.map('layers', {
        crs: L.CRS.Simple,
        zoom: -3,
        minZoom: -4,
        maxZoom: 0,
        maxBounds: [[-24 * M, -24 * M], [24 * M, 24 * M]],
    })

    const topleft = [-8 * M, -8 * M]
    const bottomright = [8 * M, 8 * M]

    L.imageOverlay('political.webp', [topleft, bottomright], { className: 'political', zIndex: 1 }).addTo(map)

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', `0 0 ${M * 2} ${M * 2}`)
    L.svgOverlay(svg, [topleft, bottomright], { interactive: true, zIndex: 5 }).addTo(map)

    map.panTo([0, 0])

    // Coordinate readout control (top-left), populated on mousemove.
    L.Control.Coords = L.Control.extend({
        onAdd: function () {
            const container = L.DomUtil.create('div', 'leaflet-control-coordinates')
            L.DomEvent.disableClickPropagation(container)
            return container
        }
    })
    new L.Control.Coords({ position: 'topleft' }).addTo(map)

    // Inner highway lines render beneath the portals.
    const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    lineGroup.setAttribute('role', 'lines')
    svg.appendChild(lineGroup)

    const portalGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    portalGroup.setAttribute('role', 'portals')
    svg.appendChild(portalGroup)

    return { map, svg, lineGroup, portalGroup }
}
