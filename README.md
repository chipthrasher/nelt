# Nelt Map

1. [Overview](#overview)
2. [History](#history)
3. [Using the Nelt Map](#using-the-nelt-map)
4. [Meta](#meta)

## Overview 

The Nelt is a **Nether ice road highway** on the [Elgeis](https://www.elgeis.com) geopolitical Minecraft server. It is based on a specific [game mechanic](https://minecraft.wiki/The_Nether#Traits) where each block in the Nether counts for 8 blocks in the overworld, making Nether travel highly efficient.

The community of Elgeis has built a grid system of ice roads, allowing players to run, fly, or boat across at high speeds. Each portal connects to these roads, making travel between any two portals very simple.

**This map provides Elgeis members with a visual representation of the Nelt, as well as a directory of all linked portals.**

It displays ice roads (lines) and Nether portals (circles), overlayed onto a map of the political claims of each nation on the server.

## History

Since its inception in 2019, there have been several endeavors to map the Nelt. In early 2020, there was no up-to-date map, so I began drawing my own manually. With a growing server population, I decided to transition the map to be automatically generated from a spreadsheet of data. The current system imports its data in real time from Google Sheets, allowing the project to be maintained by a team of contributors.

## Using the Nelt Map

The Nelt map is made up of an interactive map and a directory. _The interactive map is not visible on mobile devices._

On the directory, you can search for portals, nations, specific coordinates, and other details. A search for "Montrose" would show all portals in the nation of Montrose, and "End" would show all the public-access end portals.

Clicking on a portal in the directory will open it, revealing its coordinates, associated nation or political entity (if any), and any other details about the portal.

Several details that may appear:
- A flag icon means the portal is the capital, or main portal, for its nation or political entity.
- An atom icon means the portal leads to a public access End Portal.
- A warning icon will display a warning message about the portal. Sometimes, portals are blocked off by their owners, or are in a warzone. This section shows any applicable information.
- A globe icon means the portal leads to an IBWH (International Board of World Heritage) site.

Portals on the map are filtered as you search, so you can locate your results on the map. Your searches are remembered.

Hovering on a portal on the map shows its name and coordinates. 

Clicking on a portal on the map loads its information in the directory. 

On the map's bottom right corner, you can change the brightness of the political map.

On its top left corner, you can see the Nether and Overworld coordinates of wherever your mouse is located. This is also handy for determining the location of new Nelt portals: simply move your mosue to the desired Overworld location, and the proper Nether coordinates will show automatically.

On the top left, you can zoom in and out. You can also zoom by pressing the +/- keys, or pinching your trackpad (if applicable).

Happy Nelting!

## Meta

The Nelt map is a single-page web application built with HTML, CSS, and JavaScript. The map is built with Leaflet.js, using raster and vector layers. It relies on jQuery UI for several features (such as hover tooltips), but has been largely transitioned away from it.

The map loads a TSV output of a [Google Sheets document](https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pubhtml), containing portal, inner line, and color data. Thanks to this, it is possible for the map to continue to be maintained without my involvement, which has been my biggest goal for the project.

Please feel free to reach out if you have any questions, and view the rest of my website at [chipthrasher.com](https://chipthrasher.com/). Enjoy!
