# Copy files for comparison
cp data/map.tsv data/map.tsv.old
cp data/colors.tsv data/colors.tsv.old
cp data/lines.tsv data/lines.tsv.old

# Download data
python3 cache.py

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

    git status
    git add data
    git commit -m "$commit_message"
    git push 
else
    echo "Everything up to date, nothing to commit!"
fi

# Clean up
rm data/map.tsv.old
rm data/colors.tsv.old
rm data/lines.tsv.old
