## Nelt map

The [Nelt map](https://chipthrasher.com/nelt) is a map of the Nether highway in the [Elgeis](https://elgeis.com) political Minecraft server. It is based on the Minecraft [Nether travel mechanic](https://minecraft.gamepedia.com/The_Nether#Traits), where each block in the Nether counts for 8 blocks in the overworld. The server has a limited map size: 6000 x 6000 blocks in the overworld, and 750 x 750 in the Nether. The Nelt is built on a 7 x 7 grid of lines, extending outward based on demand. Lines are placed 100 blocks apart to efficiently cover each portal and allow for easy addition of new portals.

## How it Works

The Nelt map was originally drawn manually in a vector graphics program, but I eventually converted it to a web-based, automatic system that generates the Nelt map from a JSON file that I export from a spreadsheet. This vastly simplifies the process, allowing me to make small changes without a lot of hassle.

On page load, a map is initiated using [Leaflet.js](https://leafletjs.com), beginning with the background layers: nation borders, lines, and the blank server map.

Each portal is displayed as a dot, and unless otherwise specified, is connected to the nearest horizontal or vertical line. An exceptions list accomodates portals that are positioned in a nonstandard fashion, notably including "inner lines" which group together clusters of nearby portals that are highly trafficked. Using [Leaflet.js](https://leafletjs.com), the map zooms in and out, vectors scaling smoothly.
