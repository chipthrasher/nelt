// Builds the directory list and the SVG portal/line markup from map data.

import { MAP_SIZE_MULTIPLIER as M } from './config.js'
import { findClosestX, findClosestZ, lineDrawingMode } from './geometry.js'

// Feather icons used as portal badges in the directory.
const SVG_FLAG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>'
const SVG_APERTURE = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-aperture"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>'
const SVG_BOOK = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
const SVG_ALERT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'

function buildIcons(p) {
    let icons = ''
    if (p['National'] == 1)
        icons += `<span class="nation" title="This is the official exit for its nation or political entity.">${SVG_FLAG}</span>`
    if (p['End'] == 1)
        icons += `<span class="end" title="This exit leads to a public-access End Portal.">${SVG_APERTURE}</span>`
    if (p['IBWH'] == 1)
        icons += `<span class="ibwh" title="This exit is designated as an official IBWH site.">${SVG_BOOK}</span>`
    if (p['Warning'])
        icons += `<span class="warning" title="${p['Warning']}">${SVG_ALERT}</span>`
    return icons
}

function buildDirectoryItem(id, p, colors) {
    const x = parseInt(p['X']), z = parseInt(p['Z'])
    const color = colors[p['Political Entity']] || ''
    const wiki = p['Wiki URL']
        ? `<div><a class="wiki" href="${p['Wiki URL']}">Read more on the Wiki</a></div>`
        : ''

    return `<div class="item" data-name="${id}">
        <div class="itemtop">
            <div class="itemleft">${p['Name']}</div>
            <div class="itemright" style="background: ${color}">&nbsp;</div>
        </div>
        <div class="itemcontent">
            <div class="coords">${x}, ${z}</div>
            <div class="entity">${p['Political Entity']}</div>
            <div class="description">${p['Description']}</div>
            ${wiki}
            <div>${buildIcons(p)}</div>
        </div>
        </div>`
}

// Work out the endpoint of a portal's connector line based on its draw mode.
function computePortalGeometry(p, innerLines) {
    const x = parseInt(p['X']), z = parseInt(p['Z'])
    const innerLineId = p['Inner Line']
    const specialX = p['X Connector'], specialZ = p['Z Connector']
    const mode = lineDrawingMode(innerLines, { innerLineId, specialX, specialZ, x, z })

    let x2 = x, z2 = z
    switch (mode) {
        case 'inner': {
            const line = innerLines.find(l => innerLineId == l.ID)
            if (line) {
                if (line.x1 == line.x2) x2 = line.x2
                else if (line.z1 == line.z2) z2 = line.z2
            }
            break
        }
        case 'specialX': x2 = parseInt(specialX); break
        case 'specialZ': z2 = parseInt(specialZ); break
        case 'autoX': x2 = findClosestX(innerLines, x, z); break
        case 'autoZ': z2 = findClosestZ(innerLines, x, z); break
    }
    return { mode, x, z, x2, z2 }
}

function buildPortalGroup(id, p, innerLines) {
    const { mode, x, z, x2, z2 } = computePortalGeometry(p, innerLines)
    const dataInner = mode === 'inner' ? `data-inner="${p['Inner Line']}"` : ''

    let inner = ''
    if (mode !== 'none')
        inner += `<line class="line" ${dataInner} data-snap="auto" x1="${M + x}" y1="${M + z}" x2="${M + x2}" y2="${M + z2}" />`

    if (p['National']) {
        inner += `<circle class="circle-national-ring" cx="${M + x}" cy="${M + z}"/>`
        inner += `<circle data-name="${id}" ${dataInner} class="circle circle-national" cx="${M + x}" cy="${M + z}" title/>`
    } else {
        inner += `<circle data-name="${id}" ${dataInner} class="circle" cx="${M + x}" cy="${M + z}" title/>`
    }

    return `<g data-name="${id}" ${dataInner}>${inner}</g>`
}

function buildInnerLine(line) {
    const main = line.main == 1 ? 'true' : ''
    return `<line class="line" role="inner" data-name="${line.ID}" data-main="${main}" x1="${M + line.x1}" y1="${M + line.z1}" x2="${M + line.x2}" y2="${M + line.z2}"/>`
}

// Render the directory list, the portal markers, and the inner highway lines.
export function renderMap({ portals, colors, innerLines, lineGroup, portalGroup, directoryEl }) {
    let directory = ''
    let portalsMarkup = ''
    for (const id of Object.keys(portals)) {
        directory += buildDirectoryItem(id, portals[id], colors)
        portalsMarkup += buildPortalGroup(id, portals[id], innerLines)
    }
    portalGroup.innerHTML = portalsMarkup

    lineGroup.innerHTML = innerLines.map(buildInnerLine).join('')

    directoryEl.innerHTML = directory
}
