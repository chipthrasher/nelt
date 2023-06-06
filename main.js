/* Initial functions */

function csvJSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers=lines[0].split(",");
  for(var i=1;i<lines.length;i++){
    var obj = {};
    var currentline = lines[i].split(",");
    for(var j=0;j<headers.length;j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return JSON.stringify(result); //JSON
}

function isMobileDevice() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

const randomColor = () => {
  let color = '#';
  for (let i = 0; i < 6; i++){
     const random = Math.random();
     const bit = (random * 16) | 0;
     color += (bit).toString(16);
  };
  return color;
};

function tsvJSON(tsv) {
  const lines = tsv.split('\n');
  const headers = lines.shift().split('\t');
  return lines.map(line => {
    const data = line.split('\t');
    return headers.reduce((obj, nextKey, index) => {
      obj[nextKey] = data[index];
      return obj;
    }, {});
  });
}

function objectify(arr) {
  var newDict = {};
  for (var i of arr) {
    var title = Object.values(i)[0];
    newDict[title] = {};
    delete i["Name"];
    for (const [key, value] of Object.entries(i)) {
      newDict[title][key] = value;
    }
  }
  return newDict;
}

// var colors = {
//   "Askar": "#e6b8af",
//   "Solace": "#004d4d",
//   "Cactus Town": "#0a0",
//   "Grove Tribe": "#411010",
//   "Oberos": "#9b59b6",
//   "Championis": "#ffa846",
//   "Ozai": "#7cdce7",
//   "Kaab": "#ebd785",
//   "Wohlstand": "#3498db",
//   "Syltheim": "#ed8d18",
//   "Tree": "#989898",
//   "Obios": "#b34343",
//   "Stradova": "#4169e1",
//   "Montrose": "#f1c40f",
//   "Jericho": "#5e60e6",
//   "Shaxian Empire": "#8c00b7",
//   "Notos": "#086f85",
//   "Creenis": "#ff64ff",
//   "HUM": "#40a3fc",
//   "Blackreach": "#030303",
//   "Oostland": "#ff7100",
//   "Alliance City": "#a18b2b",
//   "Vostok": "#eb1c24",
//   "Emeraldia": "#0f0",
//   "Saru": "#00fcfc",
//   "Goomlandia": "#71368a",
//   "Redstone Valley": "#7f7f7f",
//   "Rakdos": "#dc143c",
//   "IBWH": "#fff"
// };

async function main() {
  var exits = [], colors = {}, innerLines = [];
  var content = '', directory = '';
  
  const mapTSV = await $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=0&single=true&output=tsv&callback=?");
  const innerLineTSV = await $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=576744292&single=true&output=tsv");
  const colorTSV = await $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=508864180&single=true&output=tsv");

  /* Work with colors */

  const colorData = tsvJSON(colorTSV);
  for(i in colorData) {
    colors[colorData[i]['Nation']] = colorData[i]['Color'];
  }

  /* Work with inner lines */

  const innerLineData = tsvJSON(innerLineTSV);
    for(i in innerLineData) {
      // console.log(innerLineData[i]);
      innerLines.push({
        x1: innerLineData[i]['X Position 1'],
        x2: innerLineData[i]['X Position 2'],
        y1: innerLineData[i]['Z Position 1'],
        y2: innerLineData[i]['Z Position 2'],
        ID: innerLineData[i]['ID']
      });
    }
    // console.log(innerLines);

  /* Work with map data */

  const mapData = tsvJSON(mapTSV);

  /* What to do with each line in the spreadsheet */

  $.each(mapData, function(index, info) {

    if(info['Hide'] == 1) return;
    exits[index] = info;

  });
  if(isMobileDevice()) {
    $('.right').addClass('mobileright');
    $('.left').addClass('mobileleft');
  }
  
  $('.itemcontent i').tooltip();
  $('.itemcontent i').hide(0);
  $('.wiki').hide(0);
    
  for(i in exits) {
    var name = exits[i]['Name'],
      x = parseInt(exits[i]['X']),
      z = parseInt(exits[i]['Z']),
      specialX = exits[i]['X Connector'],
      specialZ = exits[i]['Z Connector'],
      tempColor = '',
      tempIcons = '',
      tempWiki = '';
      
    content += `<circle class="circle" data-name="${i}" r="4" cx="${450 + x}" cy="${450 + z}" title/>`;
  
    /* Somehow colors doesn't have an entry for the specific political entity */
    if(colors[exits[i]['Political Entity']]) { // Set up itemright square color
      tempColor = colors[exits[i]['Political Entity']];
    } else tempColor = '';
  
    if(exits[i]['Wiki URL']) {
      tempWiki = `<div><a class="wiki" href="${exits[i]['Wiki URL']}">Read more on the Wiki</a></div>`;
    } else tempWiki = '';
  
    if(exits[i]['National'] == 1) tempIcons += '<i class="nation fas fa-flag" title="This is the official exit for its nation or political entity."></i>';
  
    if(exits[i]['End'] == 1) tempIcons += '<i class="end fas fa-atom" title="This exit leads to a public-access End Portal."></i>';
  
    if(exits[i]['IBWH'] == 1) tempIcons += '<i class="ibwh fas fa-globe" title="This exit is designated as an official IBWH site."></i>';
  
    if(exits[i]['Warning']) tempIcons += `<i class="warning fas fa-exclamation-triangle" title="${exits[i]['Warning']}"></i>`;
  
    directory += `<div class="item" data-name="${i}"><div class="itemtop"><div class="itemleft">${name}</div><div class="itemright" style="background: ${tempColor}">&nbsp;</div></div><div class="itemcontent"><div class="coords">${x}, ${z}</div><div class="entity">${exits[i]['Political Entity']}</div><div class="description">${exits[i]['Description']}</div>${tempWiki}<div>${tempIcons}</div></div></div>`;
  
    /* Render lines */
  
    if(specialX != '') { // HERE IS THE ISSUE
      specialX = parseInt(specialX);
      content +=`<line class="line" data-name="${i}" x1="${450 + x}" y1="${450 + z}" x2="${450 + specialX}" y2="${450 + z}"/>`;
  
    } else if(specialZ != '') {
      specialZ = parseInt(specialZ);
      content +=`<line class="line" data-name="${i}" x1="${450 + x}" y1="${450 + z}" x2="${450 + x}" y2="${450 + specialZ}"/>`;
  
    } else {
  
      function findClosestX(num) { // Vertical lines
        let lines = [-300,-200,-100,0,100,200,300];
        let closestLine = lines[0];
        for(let item of lines) {
          if(Math.abs(item - num) < Math.abs(closestLine - num)) closestLine = item;
        }
        return closestLine;
      }
  
      function findClosestZ(num) { // Horizontal lines
        let lines = [-300,-200,-100,0,100,200,300];
        let closestLine = lines[0];
        for(let item of lines) {
          if(Math.abs(item - num) < Math.abs(closestLine - num)) closestLine = item;
        }
        return closestLine;
      }
  
      if(Math.abs(x - findClosestX(x)) < Math.abs(z - findClosestZ(z))) {
        content +=`<line class="line" data-name="${i}" x1="${450 + x}" y1="${450 + z}" x2="${450 + findClosestX(x)}" y2="${450 + z}"/>`;
      } else {
        content +=`<line class="line" data-name="${i}" x1="${450 + x}" y1="${450 + z}" x2="${450 + x}" y2="${450 + findClosestZ(z)}"/>`;
      }
    }
  }
  
  for(i in innerLines) {
    var id = innerLines[i]['ID'];
    var x1 = parseInt(innerLines[i]['x1']);
    var x2 = parseInt(innerLines[i]['x2']);
    var y1 = parseInt(innerLines[i]['y1']);
    var y2 = parseInt(innerLines[i]['y2']);

    /* TODO: filter lines in case there's empty ones */

    content += `<line class="line inner" data-name="${id}" x1="${450 + x1}" y1="${450 + y1}" x2="${450 + x2}" y2="${450 + y2}"/>`;
  }
  
  /* Render map with Leaflet */
  
  var map = L.map('layers', {
    crs: L.CRS.Simple,
    zoom: -3,
    minZoom: -4,
    maxZoom: 0
  });
  
  var topleft = [-3600, -3600];
  var bottomright = [3600, 3600];
  
  L.imageOverlay('political.jpg', [topleft, bottomright], { className: 'political', zIndex: 1 }).addTo(map);
  L.imageOverlay('lines.svg', [topleft, bottomright], { className: 'lines', zIndex: 3 }).addTo(map);
  
  var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute('viewBox', "0 0 900 900");
  svgElement.innerHTML = content;
  L.svgOverlay(svgElement, [topleft, bottomright], {
    interactive: true, zIndex: 5
  }).addTo(map);
  
  $('.directory').append(directory);
  $('.itemcontent i').tooltip();
  
  map.panTo([0, 0]);
  
  var c = new L.Control.Coordinates({
    position: 'topleft'
  });
  c.addTo(map);
  
  // Map opacity slider
  $('.leaflet-control-attribution').html('<b>Map opacity:</b><br><input type="range" min="0" max="0.5" step="0.01" value="0.2">');
  $('.leaflet-control-attribution input').mousemove(function() {
    $('.political').css('opacity', this.value);
  });
  
  map.on('mousemove', function(e) {
      c.setCoordinates(e);
  });
  
  /* Create hover tooltips */
  
  $(".circle").tooltip({
    content: function() {
      var i = $(this).data('name');
      var name = exits[i]['Name'],
          x = exits[i]['X'],
          z = exits[i]['Z'];
  
      var content = `<div><div class="name">${name} <div class="coords">${x}, ${z}</div></div>`;
      return content;
    },
  });
  
  /* Display info on sidebar */
  
  $('.search').keyup(function() {
    $('.itemcontent').slideUp(0); // Hide any sidebar that is already open
  
    // Filter lines, circles, and sidebar items on search
    $('.circle, .line, .item').each(function() {
      if(!exits[$(this).data('name')]) return false; // Sometimes there are weird undefineds floating around
      
      var i = exits[$(this).data('name')];
      var name = i['Name'];
      var searchString = `${name} ${i['X']} ${i['Z']} ${i['Political Entity']} ${i['Description']}`.toLowerCase();
      var inputString = $('.search').val().toLowerCase();
      var searchFlag = searchString.search(inputString);
  
      if(searchFlag == -1) {
        $(this).fadeOut(0);
      } else {
        $(this).fadeIn(0);
      }
    });

    $('.item').each(function() {
      if(!exits[$(this).data('name')]) return false; // Sometimes there are weird undefineds floating around
      
      var i = exits[$(this).data('name')];
      var name = i['Name'];
      var searchString = `${name} ${i['X']} ${i['Z']} ${i['Political Entity']} ${i['Description']}`.toLowerCase();
      var inputString = $('.search').val().toLowerCase();
      var searchFlag = searchString.search(inputString);
  
      if(searchFlag == -1) {
        $(this).fadeOut(0);
      } else {
        $(this).fadeIn(0);
      }
    });
  });
  
  // UPDATE THE SIDEBAR WITH STOP INFO!!!
  $('.circle').click(function() {
    var i = $(this).data('name');
    var exitName = exits[i]['Name'];
    if($(`.item[data-name="${i}"]`).children('.itemcontent').css('display') != 'none') {
      // Clicking an already open one means everything should unhide & all items should close & search should clear
      $('.circle').each(function() {
        $(this).show(0);
      });
      $('.line').each(function() {
        $(this).show(0);
      });
      $('.search').val('');
      $('.search').trigger('keyup');
    } else {
      $('.search').val(exitName);
      $('.search').trigger('keyup');
      $(`.item[data-name="${i}"]`).children('.itemtop').trigger('click');
    }
  });
  
  $('.itemtop').click(function() {
    // console.log('Success');
    if($(this).siblings('.itemcontent').css('display') != 'none') {
      // It's open, so close it
      $(this).siblings('.itemcontent').slideUp(300);
    } else {
      // It's closed, so close everything else and open it
      $('.itemcontent').slideUp(300);
      $(this).siblings('.itemcontent').slideDown(300);
    };
  });
  
  $('.entity').click(function() { // Show all portals of same country
    $('.search').val(exits[$(this).parent().parent().data('name')]['Political Entity']);
    $('.search').trigger('keyup');
  });
  
  $('.clear').click(function() {
    $('.search').val('').trigger('keyup').focus();
  });
}

main();