const functions = {
  isMobile: () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  },
  tsvJSON: (tsv) => {
    const lines = tsv.split('\n');
    const headers = lines.shift().split('\t');
    return lines.map(line => {
      const data = line.split('\t');
      return headers.reduce((obj, nextKey, index) => {
        obj[nextKey] = data[index];
        return obj;
      }, {});
    });
  },
  findClosestX: (num) => { // Vertical lines
    let lines = [-300,-200,-100,0,100,200,300];
    let closestLine = lines[0];
    for(let item of lines) {
      if(Math.abs(item - num) < Math.abs(closestLine - num)) closestLine = item;
    }
    return closestLine;
  },
  findClosestZ: (num) => { // Horizontal lines
    let lines = [-300,-200,-100,0,100,200,300];
    let closestLine = lines[0];
    for(let item of lines) {
      if(Math.abs(item - num) < Math.abs(closestLine - num)) closestLine = item;
    }
    return closestLine;
  }
}

async function main() {
  let portals = [],
    colors = {},
    innerLines = [],
    linesContent = '',
    circlesContent = '',
    directory = '';
  
  const mapTSV = await $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=0&single=true&output=tsv&callback=?");
  const innerLineTSV = await $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=576744292&single=true&output=tsv");
  const colorTSV = await $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=508864180&single=true&output=tsv");
  
  // const mapTSV = await $.get("test/mainTest.tsv");
  // const innerLineTSV = await $.get("test/innerTest.tsv");
  // const colorTSV = await $.get("test/colorsTest.tsv");

  /*

  IMPORT MAP DATA

  */

  const colorData = functions.tsvJSON(colorTSV);
  
  for(i in colorData) {
    colors[colorData[i]['Nation']] = colorData[i]['Color'];
  }

  const innerLineData = functions.tsvJSON(innerLineTSV);
  // console.log(innerLineData);

  for(i in innerLineData) {
    let x1 = parseInt(innerLineData[i]['X Position 1']),
        z1 = parseInt(innerLineData[i]['Z Position 1']),
        x2 = parseInt(innerLineData[i]['X Position 2']),
        z2 = parseInt(innerLineData[i]['Z Position 2']),
        ID = innerLineData[i]['ID'],
        main = parseInt(innerLineData[i]['Main']);

    // console.log(x1, z1, x2, z2, ID, main);
    // Filter incomplete inner line entries
    if(isNaN(x1) || isNaN(x2) || isNaN(z1) || isNaN(z2) || isNaN(main) ) {
      continue;
    } else {
      innerLines.push({
        x1: x1,
        x2: x2,
        z1: z1,
        z2: z2,
        ID: ID,
        main: main
      });
    }
  }
  // console.log(innerLines);

  const mapData = functions.tsvJSON(mapTSV);

  $.each(mapData, (index, info) => {

    if(info['Hide'] == 1) return;
    portals[index] = info;

  });

  // Load any existing search query
  
  let params = new URLSearchParams(window.location.search);
  let q = params.get('q');
  document.querySelector('.search').value = decodeURIComponent(q);
  
  /* Render map with Leaflet */

  const mapChangeFadeLength = 0;
  const slideLength = 300;
  const mapSizeMultiplier = 450;

  $('.itemcontent i').hide(0);
  $('.wiki').hide(0);
  
  const map = L.map('layers', {
    crs: L.CRS.Simple,
    zoom: -3,
    minZoom: -4,
    maxZoom: 0,
    maxBounds: [[-24*mapSizeMultiplier, -24*mapSizeMultiplier], [24*mapSizeMultiplier, 24*mapSizeMultiplier]],
  });
  
  const topleft = [-8 * mapSizeMultiplier, -8 * mapSizeMultiplier];
  const bottomright = [8 * mapSizeMultiplier, 8 * mapSizeMultiplier];
  
  L.imageOverlay('political.jpg', [topleft, bottomright], { className: 'political', zIndex: 1 }).addTo(map);
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('viewBox', `0 0 ${mapSizeMultiplier * 2} ${mapSizeMultiplier * 2}`);
  
  L.svgOverlay(svg, [topleft, bottomright], {
    interactive: true, zIndex: 5
  }).addTo(map);

  $('.itemcontent svg').tooltip();
  
  map.panTo([0, 0]);
  
  const c = new L.Control.Coordinates({
    position: 'topleft'
  });
  c.addTo(map);

  /*

  PROCESS MAP DATA
  
  */

  const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  lineGroup.setAttribute("role", "lines");
  svg.appendChild(lineGroup);

  const portalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  portalGroup.setAttribute("role", "portals");
  svg.appendChild(portalGroup);

  if(functions.isMobile()) {

    $('#right').addClass('mobileright');
    $('#left').addClass('mobileleft');

  }

  for(i in portals) {

    portals[i]['ID'] = i;
    let name = portals[i]['Name'],
      x = parseInt(portals[i]['X']),
      z = parseInt(portals[i]['Z']),
      specialX = portals[i]['X Connector'],
      specialZ = portals[i]['Z Connector'],
      innerLineID = portals[i]['Inner Line'],
      tempColor = '',
      tempIcons = '',
      tempWiki = '',
      thisPortal = '';
      
    // Prepare data to be added to directory

    if(colors[portals[i]['Political Entity']]) {
      tempColor = colors[portals[i]['Political Entity']];
    } else tempColor = '';
  
    if(portals[i]['Wiki URL']) {
      tempWiki = `<div><a class="wiki" href="${portals[i]['Wiki URL']}">Read more on the Wiki</a></div>`;
    } else tempWiki = '';
  
    if(portals[i]['National'] == 1)
      tempIcons += '<i class="nation fas fa-flag" title="This is the official exit for its nation or political entity."></i>';
    if(portals[i]['End'] == 1)
      tempIcons += '<i class="end fas fa-atom" title="This exit leads to a public-access End Portal."></i>';
    if(portals[i]['IBWH'] == 1)
      tempIcons += '<i class="ibwh fas fa-globe" title="This exit is designated as an official IBWH site."></i>';
    if(portals[i]['Warning'])
      tempIcons += `<i class="warning fas fa-exclamation-triangle" title="${portals[i]['Warning']}"></i>`;

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
    </div>`;
  
    // ADD LINE (add line to thisPortal)

    let x1 = x,
      z1 = z,
      x2 = x,
      z2 = z,
      snap = 'auto';

    const lineDrawingMode = (p) => {
      // Check which method of line-drawing is best & valid using portals[i] = p

      // Return options:
      // - inner
      // - specialX
      // - specialZ
      // - autoX
      // - autoZ
      
      for(j in innerLines) {
        if(p['Inner Line'] == innerLines[j]['ID']) {
          // console.log(p['Name'], 'snaps to inner line', innerLines[j]);
          return 'inner';
        }
      }
      if(specialX !== '') {
        // console.log(p['Name'], 'snaps to X connector', parseInt(specialX));
        return 'specialX';
      } else if(specialZ !== '') {
        // console.log(p['Name'], 'snaps to Z connector', parseInt(specialZ));
        return 'specialZ';
      } else if(Math.abs(x - functions.findClosestX(x)) < Math.abs(z - functions.findClosestZ(z))) {
        return 'autoX';
      } else return 'autoZ';
    };

    switch(lineDrawingMode(portals[i])) {
      case 'inner':
        for(k in innerLines) {
          if(portals[i]['Inner Line'] == innerLines[k]['ID']) {
            // console.log(portals[i]['Name'], 'snaps to inner line', innerLines[k]);
            // innerLines[k] contains the inner line to draw
            let line = innerLines[k];

            if(line.x1 == line.x2) {
              // console.log(line.ID, line.x1, line.x2, line.z1, line.y2, 'is vertical');
              x2 = line.x2;
            } else if(line.z1 == line.z2) {
              // console.log(line.ID, line.x1, line.x2, line.z1, line.y2, 'is horizontal');
              z2 = line.z2;
            }
          }
        }
        break;
      case 'specialX':
        x2 = parseInt(specialX);
        break;
      case 'specialZ':
        z2 = parseInt(specialZ);
        break;
      case 'autoX':
        x2 = functions.findClosestX(x);
        break;
      case 'autoZ':
        z2 = functions.findClosestZ(z);
        break;
    }

    // Include data inner tag if there is an inner line
    // Currently: includes this in g, line, circle. Filter it down eventually
    let dataInner = '';
    if(lineDrawingMode(portals[i]) == 'inner') dataInner = `data-inner="${innerLineID}"`;

    thisPortal += `<line class="line" ${dataInner} data-snap="${snap}" x1="${mapSizeMultiplier + x1}" y1="${mapSizeMultiplier + z1}" x2="${mapSizeMultiplier + x2}" y2="${mapSizeMultiplier + z2}" />`;
     
    // ADD CIRCLE (add circle to thisPortal)
    
    thisPortal += `<circle data-name="${i}" ${dataInner} class="circle" cx="${mapSizeMultiplier + x}" cy="${mapSizeMultiplier + z}" title/>`;

    portalGroup.innerHTML += `<g data-name="${i}" ${dataInner}>${thisPortal}</g>`;
  }

  // ADD INNER LINES (add lines to lineGroup)

  for(i in innerLines) {
    let id = innerLines[i]['ID'];
    let x1 = innerLines[i]['x1'];
    let x2 = innerLines[i]['x2'];
    let z1 = innerLines[i]['z1'];
    let z2 = innerLines[i]['z2'];
    let main = '';

    if(innerLines[i]['main'] == 1) main="true";

    /* TODO: filter lines in case there's empty ones */

    lineGroup.innerHTML += `<line class="line" role="inner" data-name="${id}" data-main="${main}" x1="${mapSizeMultiplier + x1}" y1="${mapSizeMultiplier + z1}" x2="${mapSizeMultiplier + x2}" y2="${mapSizeMultiplier + z2}"/>`;
  }

  // PROCESS DIRECTORY (add directory to DOM)

  document.querySelector('#directory').innerHTML = directory;

  /*

  HANDLE EVENTS

  */
   
  /* Map opacity slider. Todo: find a less hack-y way to display this */
  $('.leaflet-control-attribution').html('<b>Map opacity:</b><br><input type="range" min="0" max="0.9" step="0.01" value="0.5">');
  $('.leaflet-control-attribution input').mousemove(function() {
    $('.political').css('opacity', this.value);
  });
  
  map.on('mousemove', function(e) {
      c.setCoordinates(e);
  });
  
  /* Create hover tooltips */
  
  $(".circle").tooltip({
    content: function() {
      // let tooltipOffset = this.getBoundingClientRect().width;
      let i = $(this).data('name');
      let name = portals[i]['Name'],
          x = portals[i]['X'],
          z = portals[i]['Z'];
      
      return `<div><div class="name">${name} <div class="coords">${x}, ${z}</div></div>`;
    },
    position: {
        my: "left+30 center",
        at: "right center"
    }
  });
  
  const mapUpdate = () => {
    let animLen = 200;
    $('.item').children('.itemcontent').slideUp(200);
    
    let searchVal = document.querySelector('.search').value;

    // Update URL

    params.set('q', encodeURIComponent(searchVal));
    let newRelativePathQuery = window.location.pathname + "?" + params.toString();
    history.replaceState(null, "", newRelativePathQuery);

    // console.log(searchVal);

    let portalsToShow = [];
    let linesToShow = [];

    let portalParentGroup = document.querySelector('g[role="portals"]');
    let portalNodes = portalParentGroup.childNodes;

    portalNodes.forEach((node) => { 
      // For each g node in the portal group, use its ID to make a search string to check against the search val.
      let thisId = node.getAttribute('data-name');
      
      // portalsToShow = [];
      
      let stringToSearch =
       `${portals[thisId]['Name']}
        ${portals[thisId]['X']}
        ${portals[thisId]['Z']}
        ${portals[thisId]['Inner Line']}
        ${portals[thisId]['Description']}
        ${portals[thisId]['Political Entity']}`;

        if(stringToSearch.toLowerCase().includes(searchVal.toLowerCase())) {
          node.classList.remove('hidden');
          $('.item[data-name="' + thisId + '"]').show(0);
          // portalsToShow.push(thisId);
          // Show portal
          // If this portal has an inner line, show that line
          if(portals[thisId]['Inner Line'] !== '') {
            // console.log(portals[thisId]['Inner Line']);
            let innerLineToAdd = portals[thisId]['Inner Line'];
            if(!linesToShow.includes(innerLineToAdd) /* If this portal has an inner line */) linesToShow.push(innerLineToAdd);
          }
        } else {
          node.classList.add('hidden');
          $('.item[data-name="' + thisId + '"]').hide(0);
          // Hide portal
        }
    });
    // console.log(linesToShow);
    
    let lineParentGroup = document.querySelector('g[role="lines"]');
    let lineNodes = lineParentGroup.childNodes;

    // Inner Line Filtering

    lineNodes.forEach((node) => {
      // console.log(node);
      let thisId = node.getAttribute('data-name');
      if(linesToShow.includes(thisId) || node.getAttribute('data-main') == "true") {
        // console.log('showing line', thisId);
        node.classList.remove('hidden');
      } else {
        node.classList.add('hidden');
      }
    });

    // console.log(linesToShow);
    // Iterate through list of portals to show
    // Check if any have an inner line. If so, add to list of inner lines to show
  }

  const directoryUpdate = (event) => { // Just closing and opening
    let animLen = 200;

    let portalId = (() => {
      if(event.target.tagName == "circle") { // Handle circle click
        // console.log(portals[event.target.getAttribute('data-name')]['Name'], 'circle triggered a directory update');
        return event.target.getAttribute('data-name');
      } else if(event.target.tagName == "DIV") { // Handle directory click
        // console.log(portals[event.target.parentNode.parentNode.getAttribute('data-name')]['Name'], 'item triggered a directory update');
        return event.target.parentNode.parentNode.getAttribute('data-name');
      }
    })();

    // Slide down/up as needed

    if($('.item[data-name=' + portalId + ']').children('.itemcontent').css('display') == 'none') { // Is hidden
      $('.item[data-name=' + portalId + ']').children('.itemcontent').slideDown(animLen);
    } else { // Is shown
      $('.item[data-name=' + portalId + ']').children('.itemcontent').slideUp(animLen);
    }
  }

  // Search bar updated
  $('.search').keyup((e) => {
    // console.log('Search updated');
    mapUpdate();
  });
  
  // Portal clicked
  const circleElements = document.getElementsByClassName('circle');

  for(let i = 0; i < circleElements.length; i++) {
    circleElements[i].addEventListener('click', (e) => {
      // e.target is the circle element
      // console.log('Circle got clicked', e.target);

      let clickedCircleName = portals[e.target.parentNode.getAttribute('data-name')]['Name'];

      if(document.querySelector('.search').value == clickedCircleName) {
        // If the search bar is already set to this portal, clear it
        document.querySelector('.search').value = '';
      } else {
        // Set search to circle
        document.querySelector('.search').value = clickedCircleName;
      }
      mapUpdate();
      directoryUpdate(e);
    }, false); 
  }
  
  // Directory item clicked
  const itemtopElements = document.getElementsByClassName('itemtop');

  for(let i = 0; i < itemtopElements.length; i++) {
    itemtopElements[i].addEventListener('click', (e) => {
      // e.target.parentNode is the itemtop element
      // console.log('Itemtop got clicked', e.target.parentNode);
      directoryUpdate(e);
    }, false); 
  }
  
  // Political entity clicked
  const entityElements =  document.getElementsByClassName('entity');

  for(let i = 0; i < entityElements.length; i++) {
    entityElements[i].addEventListener('click', (e) => {
      // console.log(e.target.innerHTML);
      document.querySelector('.search').value = e.target.innerHTML;
      mapUpdate();
    }, false); 
  }

  
  // Search clear clicked
  document.querySelector('.clear').addEventListener('click', (e) => {
    document.querySelector('.search').value = '';
    mapUpdate();
  }, false);
}

main();