// Wires up search, the directory list, the map markers, and the URL state.

import { ANIM_LEN } from './utils.js'
import { el } from './dom.js'

export function wireEvents({ map, portals }) {
    const searchInput = document.querySelector('.search')
    let searchVal

    /* Live coordinate readout */

    function updateCoords(e) {
        const x = (e.latlng.lng * 1).toFixed(0)
        const y = (e.latlng.lat * -1).toFixed(0)
        const nethX = Math.floor(x / 8)
        const nethY = Math.floor(y / 8)

        document.querySelector('.leaflet-control-coordinates').innerHTML = `
            <strong>Overworld:</strong><br>
            <span class="mono">${x}, ${y}</span><br>
            <strong>Nether:</strong><br>
            <span class="mono">${nethX}, ${nethY}</span>
        `
    }
    map.on('mousemove', updateCoords)

    /* Hover tooltips */

    tippy.setDefaultProps({
        animation: 'fade',
        trigger: 'mouseenter',
        duration: 100,
        // Tooltip content is untrusted spreadsheet text; never parse it as HTML.
        // The circle tooltip below passes a prebuilt DOM node instead.
        allowHTML: false,
        arrow: false,
        placement: 'right'
    })

    for (const span of document.querySelectorAll('.itemcontent span')) {
        tippy(span, { content: span.getAttribute('title') })
    }

    for (const c of document.querySelectorAll('.circle')) {
        const id = c.getAttribute('data-name')
        const p = portals[id]
        const content = el('div', {}, [
            el('div', { class: 'name' }, p['Name']),
            el('div', { class: 'coords' }, `${p['X']}, ${p['Z']}`),
        ])
        tippy(c, {
            content,
            triggerTarget: [c, document.querySelector(`.item[data-name="${id}"] .itemtop`)]
        })
    }

    /* Search / filter: show portals (and their inner lines) matching the query */

    const params = new URLSearchParams(window.location.search)

    const mapUpdate = () => {
        // Close all open directory items
        for (const item of document.querySelectorAll('.item')) {
            window.domSlider.slideUp({ element: item.children[1], slideSpeed: ANIM_LEN })
            item.children[1].classList.add('none')
        }

        // Reflect the search value in the URL
        searchVal = searchInput.value
        let newRelativePathQuery = window.location.pathname
        if (searchVal !== '') {
            params.set('q', encodeURIComponent(searchVal))
            newRelativePathQuery += '?' + params.toString()
        }
        history.replaceState(null, '', newRelativePathQuery)

        const linesToShow = []
        const query = searchVal.toLowerCase()

        document.querySelector('g[role="portals"]').childNodes.forEach((node) => {
            const id = node.getAttribute('data-name')
            const p = portals[id]
            const haystack = [
                p['Name'], p['X'], p['Z'], p['Inner Line'], p['Description'], p['Political Entity']
            ].join('\n').toLowerCase()
            const item = document.querySelector(`.item[data-name="${id}"]`)

            if (haystack.includes(query)) {
                node.classList.remove('hidden')
                item.classList.remove('hidden')
                if (p['Inner Line'] !== '' && !linesToShow.includes(p['Inner Line'])) {
                    linesToShow.push(p['Inner Line'])
                }
            } else {
                node.classList.add('hidden')
                item.classList.add('hidden')
            }
        })

        // Show an inner line if a visible portal uses it, or if it's a main line
        document.querySelector('g[role="lines"]').childNodes.forEach((node) => {
            const id = node.getAttribute('data-name')
            const show = linesToShow.includes(id) || node.getAttribute('data-main') === 'true'
            node.classList.toggle('hidden', !show)
        })
    }

    // Toggle a directory item open/closed (used by both list and marker clicks)
    const directoryUpdate = (event) => {
        const portalId = event.target.closest('[data-name]')?.getAttribute('data-name')

        const content = document.querySelector(`.item[data-name="${portalId}"] .itemcontent`)
        if (content.classList.contains('DOM-slider-hidden')) {
            window.domSlider.slideDown({ element: content, slideSpeed: ANIM_LEN })
        } else {
            window.domSlider.slideUp({ element: content, slideSpeed: ANIM_LEN })
        }
    }

    searchInput.addEventListener('keyup', () => {
        // Ignore keyup if the search value hasn't changed
        if (searchInput.value !== searchVal) mapUpdate()
    })

    /* Directory item events */

    const itemtopElements = document.getElementsByClassName('itemtop')

    for (let i = 0; i < itemtopElements.length; i++) {
        // Open/close the item, then pan to its portal if it's off-screen
        itemtopElements[i].addEventListener('click', (e) => {
            directoryUpdate(e)

            const id = e.target.parentNode.parentNode.getAttribute('data-name')
            const rect = document.querySelector(`.circle[data-name="${id}"]`).getBoundingClientRect()

            // The right edge is covered by #right
            const viewportRight = document.querySelector('#right').getBoundingClientRect().left
            const shouldBePanned = rect.right > viewportRight || rect.left < 0 || rect.bottom > window.innerHeight || rect.top < 0
            if (shouldBePanned) {
                map.panTo([-portals[id]['Z'] * 8, portals[id]['X'] * 8], {
                    duration: ANIM_LEN / 1000,
                    animate: true
                })
            }
        }, false)

        // Highlight the matching marker on hover
        itemtopElements[i].addEventListener('mouseover', (e) => {
            const name = e.target.parentNode.parentNode.getAttribute('data-name')
            const circle = document.querySelector(`.circle[data-name="${name}"]`)
            if (!circle) console.warn(`mouseover: no circle found for list item data-name="${name}"`)
            circle?.classList.add('hoveredCircle')
        }, false)

        itemtopElements[i].addEventListener('mouseout', (e) => {
            const name = e.target.parentNode.parentNode.getAttribute('data-name')
            const circle = document.querySelector(`.circle[data-name="${name}"]`)
            if (!circle) console.warn(`mouseout: no circle found for list item data-name="${name}"`)
            circle?.classList.remove('hoveredCircle')
        }, false)
    }

    /* Map marker (circle) events */

    for (const circle of document.querySelectorAll('.circle')) {
        const id = circle.getAttribute('data-name')
        // Pair each marker with its directory item by data-name, not by index
        const itemtop = document.querySelector(`.item[data-name="${id}"] .itemtop`)

        // Click a marker to search for it (or clear if already searched)
        circle.addEventListener('click', (e) => {
            const clickedCircleName = portals[id]['Name']
            searchInput.value = searchInput.value === clickedCircleName ? '' : clickedCircleName
            mapUpdate()
            directoryUpdate(e)
        }, false)

        // Mirror marker hover onto the matching directory item
        circle.addEventListener('mouseover', () => {
            itemtop?.classList.add('itemtopHover')
        }, false)

        circle.addEventListener('mouseout', () => {
            itemtop?.classList.remove('itemtopHover')
        }, false)
    }

    /* Political entity click: search for that entity */

    for (const entity of document.getElementsByClassName('entity')) {
        entity.addEventListener('click', (e) => {
            searchInput.value = e.target.textContent
            mapUpdate()
        }, false)
    }

    /* Clear search */

    document.querySelector('.clear').addEventListener('click', () => {
        searchInput.value = ''
        mapUpdate()
    }, false)

    // Seed the search bar from the URL, then do the initial render
    const q = params.get('q')
    if (q !== null) searchInput.value = decodeURIComponent(q)
    mapUpdate()
}
