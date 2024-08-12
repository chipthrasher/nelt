async function main() {
    const functions = {
        isMobile: () => {
            let check = false;

            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check
        },
        tsvJSON: (tsv) => {
            const lines = tsv.split('\n')
            const headers = lines.shift().split('\t')
            return lines.map(line => {
                const data = line.split('\t')
                return headers.reduce((obj, nextKey, index) => {
                    obj[nextKey] = data[index]
                    return obj
                }, {})
            })
        },
        findClosestX: (num) => { // Vertical lines
            let lines = [-300, -200, -100, 0, 100, 200, 300, 400]
            let closestLine = lines[0]
            for (let item of lines) {
                if (Math.abs(item - num) < Math.abs(closestLine - num)) closestLine = item
            }
            return closestLine
        },
        findClosestZ: (num) => { // Horizontal lines
            let lines = [-400, -300, -200, -100, 0, 100, 200, 300, 400]
            let closestLine = lines[0]
            for (let item of lines) {
                if (Math.abs(item - num) < Math.abs(closestLine - num)) closestLine = item
            }
            return closestLine
        }
    }

    let portals = [],
        colors = {},
        innerLines = [],
        linesContent = '',
        circlesContent = '',
        directory = ''

    const animLen = 200

    let searchVal

    /*
    
    Import data for map
    
    */

    // Load cached data

    let mapTSV, lineTSV, colorTSV, response = await fetch("data/map.tsv")
    if (response.ok) {
        mapTSV = await response.text()
    } else {
        console.error("Failed to fetch map.tsv:", response.status)
    }

    response = await fetch("data/lines.tsv")
    if (response.ok) {
        lineTSV = await response.text()
    } else {
        console.error("Failed to fetch lines.tsv:", response.status)
    }

    response = await fetch("data/colors.tsv")
    if (response.ok) {
        colorTSV = await response.text()
    } else {
        console.error("Failed to fetch colors.tsv:", response.status)
    }

    // Process colors
    const colorData = functions.tsvJSON(colorTSV)

    for (i in colorData) {
        colors[colorData[i]['Nation']] = colorData[i]['Color']
    }

    // Process lines
    const lineData = functions.tsvJSON(lineTSV)

    for (i in lineData) {
        let x1 = parseInt(lineData[i]['X Position 1']),
            z1 = parseInt(lineData[i]['Z Position 1']),
            x2 = parseInt(lineData[i]['X Position 2']),
            z2 = parseInt(lineData[i]['Z Position 2']),
            ID = lineData[i]['ID'],
            main = parseInt(lineData[i]['Main'])

        if (isNaN(x1) || isNaN(x2) || isNaN(z1) || isNaN(z2) || isNaN(main))
            continue
        else {
            innerLines.push({
                x1: x1,
                x2: x2,
                z1: z1,
                z2: z2,
                ID: ID,
                main: main
            })
        }
    }

    // Process map data

    const mapData = functions.tsvJSON(mapTSV)

    for (const [index, info] of Object.entries(mapData)) {
        if (info['Hide'] == '1')
            continue;
        portals[index] = info
    }

    /* Render map with Leaflet */

    // A constant representing the distance between the world border and 0, 0 in the Nether. 
    const mapSizeMultiplier = 500

    for (let i of document.querySelectorAll('.itemcontent i, .wiki')) {
        i.classList.add('hidden')
    }

    const map = L.map('layers', {
        crs: L.CRS.Simple,
        zoom: -3,
        minZoom: -4,
        maxZoom: 0,
        maxBounds: [[-24 * mapSizeMultiplier, -24 * mapSizeMultiplier], [24 * mapSizeMultiplier, 24 * mapSizeMultiplier]],
    })

    const topleft = [-8 * mapSizeMultiplier, -8 * mapSizeMultiplier]
    const bottomright = [8 * mapSizeMultiplier, 8 * mapSizeMultiplier]

    L.imageOverlay('political.jpg', [topleft, bottomright], { className: 'political', zIndex: 1 }).addTo(map)

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute('viewBox', `0 0 ${mapSizeMultiplier * 2} ${mapSizeMultiplier * 2}`)

    L.svgOverlay(svg, [topleft, bottomright], {
        interactive: true, zIndex: 5
    }).addTo(map)

    map.panTo([0, 0])

    L.Control.Coords = L.Control.extend({
        onAdd: function (map) {
            var className = 'leaflet-control-coordinates'
            container = L.DomUtil.create('div', className)
            L.DomEvent.disableClickPropagation(container)
            return container
        }
    })

    new L.Control.Coords({
        position: 'topleft'
    }).addTo(map)

    /*

    PROCESS MAP DATA

    */

    const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    lineGroup.setAttribute("role", "lines")
    svg.appendChild(lineGroup)

    const portalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    portalGroup.setAttribute("role", "portals")
    svg.appendChild(portalGroup)

    if (functions.isMobile()) {

        document.getElementById('right').classList.add('mobileright')
        document.getElementById('left').classList.add('mobileleft')

    }

    for (i in portals) {

        portals[i]['ID'] = i
        let name = portals[i]['Name'],
            x = parseInt(portals[i]['X']),
            z = parseInt(portals[i]['Z']),
            specialX = portals[i]['X Connector'],
            specialZ = portals[i]['Z Connector'],
            innerLineID = portals[i]['Inner Line'],
            tempColor = '',
            tempIcons = '',
            tempWiki = '',
            thisPortal = ''

        // Prepare data to be added to directory

        if (colors[portals[i]['Political Entity']]) {
            tempColor = colors[portals[i]['Political Entity']]
        } else tempColor = ''

        if (portals[i]['Wiki URL']) {
            tempWiki = `<div><a class="wiki" href="${portals[i]['Wiki URL']}">Read more on the Wiki</a></div>`
        } else tempWiki = ''

        if (portals[i]['National'] == 1)
            tempIcons += '<i class="nation fas fa-flag" title="This is the official exit for its nation or political entity."></i>'
        if (portals[i]['End'] == 1)
            tempIcons += '<i class="end fas fa-atom" title="This exit leads to a public-access End Portal."></i>'
        if (portals[i]['IBWH'] == 1)
            tempIcons += '<i class="ibwh fas fa-globe" title="This exit is designated as an official IBWH site."></i>'
        if (portals[i]['Warning'])
            tempIcons += `<i class="warning fas fa-exclamation-triangle" title="${portals[i]['Warning']}"></i>`

        // Add item to directory

        directory +=
            `<div class="item" data-name="${i}">
        <div class="itemtop">
            <div class="itemleft">${name}</div>
            <div class="itemright" style="background: ${tempColor}">&nbsp;</div>
        </div>
        <div class="itemcontent">
            <div class="coords">${x}, ${z}</div>
            <div class="entity">${portals[i]['Political Entity']}</div>
            <div class="description">${portals[i]['Description']}</div>
            ${tempWiki}
            <div>${tempIcons}</div>
        </div>
        </div>`

        // ADD LINE (add line to thisPortal)

        let x1 = x,
            z1 = z,
            x2 = x,
            z2 = z,
            snap = 'auto'

        const lineDrawingMode = (p) => {
            // Check which method of line-drawing is best & valid using portals[i] = p

            // Return options:
            // - inner
            // - specialX
            // - specialZ
            // - autoX
            // - autoZ

            for (j in innerLines) {
                if (p['Inner Line'] == innerLines[j]['ID']) {
                    // console.log(p['Name'], 'snaps to inner line', innerLines[j])
                    return 'inner'
                }
            }
            if (specialX !== '') {
                // console.log(p['Name'], 'snaps to X connector', parseInt(specialX))
                return 'specialX'
            } else if (specialZ !== '') {
                // console.log(p['Name'], 'snaps to Z connector', parseInt(specialZ))
                return 'specialZ'
            } else if (Math.abs(x - functions.findClosestX(x)) < Math.abs(z - functions.findClosestZ(z))) {
                return 'autoX'
            } else return 'autoZ'
        }

        switch (lineDrawingMode(portals[i])) {
            case 'inner':
                for (k in innerLines) {
                    if (portals[i]['Inner Line'] == innerLines[k]['ID']) {
                        // console.log(portals[i]['Name'], 'snaps to inner line', innerLines[k])
                        // innerLines[k] contains the inner line to draw
                        let line = innerLines[k]

                        if (line.x1 == line.x2) {
                            // console.log(line.ID, line.x1, line.x2, line.z1, line.y2, 'is vertical')
                            x2 = line.x2
                        } else if (line.z1 == line.z2) {
                            // console.log(line.ID, line.x1, line.x2, line.z1, line.y2, 'is horizontal')
                            z2 = line.z2
                        }
                    }
                }
                break
            case 'specialX':
                x2 = parseInt(specialX)
                break
            case 'specialZ':
                z2 = parseInt(specialZ)
                break
            case 'autoX':
                x2 = functions.findClosestX(x)
                break
            case 'autoZ':
                z2 = functions.findClosestZ(z)
                break
        }

        // Include data inner tag if there is an inner line
        // Currently: includes this in g, line, circle. Filter it down eventually
        let dataInner = ''
        if (lineDrawingMode(portals[i]) == 'inner') dataInner = `data-inner="${innerLineID}"`

        thisPortal += `<line class="line" ${dataInner} data-snap="${snap}" x1="${mapSizeMultiplier + x1}" y1="${mapSizeMultiplier + z1}" x2="${mapSizeMultiplier + x2}" y2="${mapSizeMultiplier + z2}" />`

        // ADD CIRCLE (add circle to thisPortal)

        thisPortal += `<circle data-name="${i}" ${dataInner} class="circle" cx="${mapSizeMultiplier + x}" cy="${mapSizeMultiplier + z}" title/>`

        portalGroup.innerHTML += `<g data-name="${i}" ${dataInner}>${thisPortal}</g>`
    }

    // ADD INNER LINES (add lines to lineGroup)

    for (i in innerLines) {
        let id = innerLines[i]['ID']
        let x1 = innerLines[i]['x1']
        let x2 = innerLines[i]['x2']
        let z1 = innerLines[i]['z1']
        let z2 = innerLines[i]['z2']
        let main = ''

        if (innerLines[i]['main'] == 1) main = "true"

        /* TODO: filter lines in case there's empty ones */

        lineGroup.innerHTML += `<line class="line" role="inner" data-name="${id}" data-main="${main}" x1="${mapSizeMultiplier + x1}" y1="${mapSizeMultiplier + z1}" x2="${mapSizeMultiplier + x2}" y2="${mapSizeMultiplier + z2}"/>`
    }

    // PROCESS DIRECTORY (add directory to DOM)

    document.querySelector('#directory').innerHTML = directory

    /*

    HANDLE EVENTS

    */

    /* Map opacity slider. Todo: find a less hack-y way to display this */
    document.querySelector('.leaflet-control-attribution').innerHTML = ''
    // $('.leaflet-control-attribution').html('<b>Map opacity:</b><br><input type="range" min="0" max="0.9" step="0.01" value="0.4">')
    // $('.leaflet-control-attribution input').mousemove(function () {
    //     $('.political').css('opacity', this.value)
    //     $('g[role="lines"]').css('opacity', this.value)
    // })

    function updateCoords(e) {
        let x = (e.latlng.lng * 1).toFixed(0)
        let y = (e.latlng.lat * -1).toFixed(0)

        let nethX = Math.floor(x / 8)
        let nethY = Math.floor(y / 8)

        document.querySelector('.leaflet-control-coordinates').innerHTML =
            `
            <strong>Overworld:</strong><br>
            <span class="mono">${x}, ${y}</span><br>
            <strong>Nether:</strong><br>
            <span class="mono">${nethX}, ${nethY}</span>
        `
    }

    map.on('mousemove', function (e) {
        updateCoords(e)
    })

    /* Create hover tooltips */

    tippy.setDefaultProps({
        animation: 'fade',
        trigger: 'mouseenter',
        duration: 100,
        allowHTML: true,
        arrow: false,
        placement: 'right'
    })

    // Iterate through document.querySelectorAll('.itemcontent i'). Use tippy on each
    for (let i of document.querySelectorAll('.itemcontent i')) {
        tippy(i, {
            content: i.getAttribute('title')
        })
    }

    for (let c of document.querySelectorAll('.circle')) {
        let i = c.getAttribute('data-name')
        let name = portals[i]['Name'],
            x = portals[i]['X'],
            z = portals[i]['Z']

        tippy(c, {
            content: `<div class="name">${name}</div> <div class="coords">${x}, ${z}`,
            triggerTarget: [c, document.querySelector('.item[data-name="' + i + '"] .itemtop')]
        })
    }

    const mapUpdate = () => {
        // Close all item contents
        for (let i of document.querySelectorAll('.item')) {

            window.domSlider.slideUp({
                element: i.children[1],
                slideSpeed: animLen
            })
            // i.children[1].style.display = 'none'
            i.children[1].classList.add('none')
        }
        
        // Update URL based on search value
        
        searchVal = document.querySelector('.search').value

        let newRelativePathQuery = window.location.pathname;
        if (searchVal !== '') {
            params.set('q', encodeURIComponent(searchVal))
            newRelativePathQuery += "?" + params.toString()
        }
        history.replaceState(null, "", newRelativePathQuery)


        let linesToShow = []

        let portalParentGroup = document.querySelector('g[role="portals"]')
        let portalNodes = portalParentGroup.childNodes

        portalNodes.forEach((node) => {
            // For each g node in the portal group, use its ID to make a search string to check against the search val.
            let thisId = node.getAttribute('data-name')

            // portalsToShow = []

            let stringToSearch =
                `${portals[thisId]['Name']}
            ${portals[thisId]['X']}
            ${portals[thisId]['Z']}
            ${portals[thisId]['Inner Line']}
            ${portals[thisId]['Description']}
            ${portals[thisId]['Political Entity']}`

            if (stringToSearch.toLowerCase().includes(searchVal.toLowerCase())) {
                // Show portal
                node.classList.remove('hidden')

                // Show directory item (whitelist)
                document.querySelector('.item[data-name="' + thisId + '"]').classList.remove('hidden')

                // If this portal has an inner line, show that line
                if (portals[thisId]['Inner Line'] !== '') {
                    // console.log(portals[thisId]['Inner Line'])
                    let innerLineToAdd = portals[thisId]['Inner Line']
                    if (!linesToShow.includes(innerLineToAdd) /* If this portal has an inner line */)
                        linesToShow.push(innerLineToAdd)
                }
            } else {
                // Hide portal
                node.classList.add('hidden')

                document.querySelector('.item[data-name="' + thisId + '"]').classList.add('hidden')
            }
        })
        // console.log(linesToShow)

        let lineParentGroup = document.querySelector('g[role="lines"]')
        let lineNodes = lineParentGroup.childNodes

        // Inner Line Filtering

        lineNodes.forEach((node) => {
            // console.log(node)
            let thisId = node.getAttribute('data-name')
            if (linesToShow.includes(thisId) || node.getAttribute('data-main') == "true") {
                // console.log('showing line', thisId)
                node.classList.remove('hidden')
            } else {
                node.classList.add('hidden')
            }
        })
    }

    // Handle closing & opening directory items, depending on what's clicked
    // Also now, zoom to the clicked portal!

    const directoryUpdate = (event) => {
        // Get portal ID from event
        const portalId = (() => {
            if (event.target.tagName == "circle") { // Handle circle click
                // console.log(portals[event.target.getAttribute('data-name')]['Name'], 'circle triggered a directory update')
                return event.target.getAttribute('data-name')
            } else if (event.target.tagName == "DIV") { // Handle directory click
                // console.log(portals[event.target.parentNode.parentNode.getAttribute('data-name')]['Name'], 'item triggered a directory update')
                return event.target.parentNode.parentNode.getAttribute('data-name')
            }
        })()

        // Slide down/up as needed

        if (document.querySelector('.item[data-name="' + portalId + '"] .itemcontent').classList.contains('DOM-slider-hidden')) { // Is hidden
            window.domSlider.slideDown({
                element: document.querySelector('.item[data-name="' + portalId + '"] .itemcontent'),
                slideSpeed: animLen
            })

            // Needs to be zoomed to

        } else { // Is shown
            window.domSlider.slideUp({
                element: document.querySelector('.item[data-name="' + portalId + '"] .itemcontent'),
                slideSpeed: animLen
            })

            // Don't zoom here because it's just being closed
        }

    }

    document.querySelector('.search').addEventListener('keyup', (e) => {
        if (document.querySelector('.search').value != searchVal)
            mapUpdate() // Ignore keyup if the search value hasn't changed
    })

    // Directory item events
    const itemtopElements = document.getElementsByClassName('itemtop')

    for (let i = 0; i < itemtopElements.length; i++) {

        // On click, open directory

        itemtopElements[i].addEventListener('click', (e) => {
            // e.target.parentNode is the itemtop element
            // console.log('Itemtop got clicked', e.target.parentNode)
            directoryUpdate(e) // Slide down/up as needed

            // Pan to portal, if necessary

            const id = e.target.parentNode.parentNode.getAttribute('data-name')
            const rect = document.querySelector(`.circle[data-name="${id}"]`).getBoundingClientRect()

            // Special case for the right side, which is blocked by #right.
            const viewportRight = document.querySelector('#right').getBoundingClientRect().left

            const shouldBePanned = rect.right > viewportRight || rect.left < 0 || rect.bottom > window.innerHeight || rect.top < 0
            if (shouldBePanned) {
                const x = portals[id]['X']
                const z = portals[id]['Z']

                map.panTo([-z * 8, x * 8], {
                    duration: (animLen / 1000),
                    animate: true
                })
            }
        }, false)

        // On mouseover, show tooltip

        itemtopElements[i].addEventListener('mouseover', (e) => {
            // e.target.parentNode is the itemtop element
            document.querySelector(`.circle[data-name="${e.target.parentNode.parentNode.getAttribute('data-name')}"]`).classList.add('hoveredCircle')
        }, false)

        // On mouseout, hide tooltip

        itemtopElements[i].addEventListener('mouseout', (e) => {
            // e.target.parentNode is the itemtop element
            document.querySelector(`.circle[data-name="${e.target.parentNode.parentNode.getAttribute('data-name')}"]`).classList.remove('hoveredCircle')
        }, false)
    }

    // Circle events
    const circleElements = document.getElementsByClassName('circle')

    for (let i = 0; i < circleElements.length; i++) {

        // On click, set search bar

        circleElements[i].addEventListener('click', (e) => {
            // e.target is the circle element
            // console.log('Circle got clicked', e.target)

            let clickedCircleName = portals[e.target.parentNode.getAttribute('data-name')]['Name']

            if (document.querySelector('.search').value == clickedCircleName) {
                // If the search bar is already set to this portal, clear it
                document.querySelector('.search').value = ''
            } else {
                // Set search to circle
                document.querySelector('.search').value = clickedCircleName
            }
            mapUpdate()
            directoryUpdate(e)
        }, false)

        // On mouseover, add hover class to associated itemtop

        circleElements[i].addEventListener('mouseover', (e) => {
            itemtopElements[i].classList.add('itemtopHover')
        }, false)

        // On mouseout, take away hover class from associated itemtop

        circleElements[i].addEventListener('mouseout', (e) => {
            itemtopElements[i].classList.remove('itemtopHover')
        }, false)
    }

    // Political entity events
    const entityElements = document.getElementsByClassName('entity')

    for (let i = 0; i < entityElements.length; i++) {

        // On click: set search bar

        entityElements[i].addEventListener('click', (e) => {
            // console.log(e.target.innerHTML)
            document.querySelector('.search').value = e.target.innerHTML
            mapUpdate()
        }, false)
    }

    // Search clear clicked

    document.querySelector('.clear').addEventListener('click', (e) => {
        document.querySelector('.search').value = ''
        mapUpdate()
    }, false)

    // At page load, set search bar from URL params

    let params = new URLSearchParams(window.location.search)
    let q = params.get('q')
    if (q == null) { q = '' } else {
        document.querySelector('.search').value = decodeURIComponent(q)
    }
    
    // Start with an initial mapUpdate
    mapUpdate()
}

main()