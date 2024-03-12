# This script caches the data from the Google Sheets to the local files and commits the changes to the repository.
# Should be run daily. It's not ideal to have to do this, but GitHub Pages prevents any server-side solution, so
# this is the best solution for load times for now.

# Copy files for comparison
cp data/map.tsv data/map.tsv.old
cp data/colors.tsv data/colors.tsv.old
cp data/lines.tsv data/lines.tsv.old

# Download data
curl -L -o "data/map.tsv" "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=0&single=true&output=tsv&callback=?"
curl -L -o "data/lines.tsv" "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=576744292&single=true&output=tsv"
curl -L -o "data/colors.tsv" "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwok3n0HC0TmlJt4gG-C6JXFEInJfcm4zDb4YKtwsLW78TZu5BA3r9FM_EbarcO0q5V2QDAv2QdTGQ/pub?gid=508864180&single=true&output=tsv"

# Find differences
map=$(diff data/map.tsv data/map.tsv.old)
lines=$(diff data/lines.tsv data/lines.tsv.old)
colors=$(diff data/colors.tsv data/colors.tsv.old)

# Only commit if there are changes
if [ -n "$map" ] || [ -n "$lines" ] || [ -n "$colors" ]; then
    short_date=$(date +"%m/%d")
    long_date=$(date +"%Y/%m/%d at %H:%M:%S")

    commit_message='Daily Cache '$short_date'
Diff:'$map$lines$colors'

This daily update was executed on '$long_date''

    echo $commit_message

    # git status
    # git add data
    # git commit -m "$commit_message"
    # git push 
else
    echo "Everything up to date, nothing to commit!"
fi

# Clean up
rm data/map.tsv.old
rm data/colors.tsv.old
rm data/lines.tsv.old
