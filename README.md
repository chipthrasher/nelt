# NELT map

The [NELT map](https://chipthrasher.com/nelt) is a map of the Nether highway in the [Elgeis](https://elgeis.com) political Minecraft server. It is based on the Minecraft [Nether travel mechanic](https://minecraft.gamepedia.com/The_Nether#Traits), where each block in the Nether counts for 8 blocks in the overworld. The server has a limited map size (6000x6000 in the overworld, and 750x750 in the Nether). The map is based on a 5x5 line structure — although this structure will extend outward based on demand — lines each placed 100 blocks apart to efficiently cover each portal and allow for new ones to be added easily.

Until recently, the NELT map was manually drawn in a graphics program, but I've recently converted it to an automatic system that generates the NELT map from a JSON file that I export from a spreadsheet. This vastly simplifies the process, allowing me to make small changes without a lot of hassle.

## Generating the Map

The map is initiated using [Leaflet.js](https://leafletjs.com), and the background layers (nation borders, lines, and the server map render) are listed.
On page load, each portal is generated into an SVG, and unless otherwise specified, it snaps to the nearest line, horizontal or vertical. To accomodate for portals that are placed in a nonstandard way, I have an exceptions list, notably including the portals on the Goomlandian Inner Line (which makes travel much more convenient inside the in-game nation Goomlandia). Using [Leaflet.js](https://leafletjs.com), the map zooms in and out, vectors scaling smoothly. I used jQuery UI's [tooltip functionality](https://api.jqueryui.com/tooltip) to show a snippet of data for each portal when it's hovered over, including coordinates, the portal's name, and a picture and description.
