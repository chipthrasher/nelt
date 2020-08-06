# NELT Map

The [NELT map](https://chipthrasher.com/nelt) is a map of the well-developed Nether highway in the [Elgeis](https://elgeis.com) political Minecraft server. It is based on the Minecraft [Nether travel mechanic](https://minecraft.gamepedia.com/The_Nether#Traits), where each block in the Nether counts for 8 blocks in the overworld. The server has a limited map size (6000 x 6000 in the overworld, and 750 x 750 in the Nether) to encourage political interaction, but this makes mapping and travel much easier, and gives the NELT map a determined size The map is structured with 5 lines going north/south, and 5 lines going east/west, each placed 100 blocks apart to efficiently cover each portal and allow for new ones to be added easily. In the future, if the map is expanded, the standard line system can be expanded to 7x7 or more.

Until recently, the NELT map was manually drawn in a graphics program, but for interactivity, convenience, and community involvement, I recently converted it to an automatically generated system. It's written entirely in frontend languages (HTML, CSS, and JavaScript), and imports a JSON file with each exit. To update the map, I take my Google spreadsheet that contains all the data & convert it to JSON for the site. Everything is imported from the Google Sheet, making it a vastly more simple process to update, and much easier to integrate small changes into the map when needed. This also allows for other members of the community to provide writing and new portal information for the map.

On page load, each portal is generated into an SVG, and unless otherwise specified, it snaps to the nearest line, horizontal or vertical. To accomodate for portals that are placed in a nonstandard way, I have an exceptions list, notably including the portals on the Goomlandian Inner Line (which makes travel much more convenient inside the in-game nation Goomlandia). Using [Leaflet.js](https://leafletjs.com), the map zooms in and out, vectors scaling smoothly. I used jQuery UI's [tooltip functionality](https://api.jqueryui.com/tooltip) to show a snippet of data for each portal when it's hovered over, including coordinates, the portal's name, and a picture and description.

**The NELT map is live at https://chipthrasher.com/nelt — enjoy!**
