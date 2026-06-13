#!/bin/bash

# Pull map data from Google Sheets.
# Since the Nelt map data is cached in production, you will need to download it directly to test locally.

mkdir -p $(pwd)/data

curl -L -o "$(pwd)/data/map.tsv" "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=0&single=true&output=tsv&callback=?"
curl -L -o "$(pwd)/data/lines.tsv" "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=576744292&single=true&output=tsv"
curl -L -o "$(pwd)/data/colors.tsv" "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=508864180&single=true&output=tsv"
