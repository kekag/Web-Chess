#!/bin/bash

# script to change chess piece colors

if [[ $# -lt 2 ]]; then # defaults
	WHITE="#EDEDED"
	BLACK="#0F0F0F"
else # colors as arguments
	WHITE=$1
	BLACK=$2
fi	

PATTERN="fill=\"#.{6}\""

for f in *.svg; do
	COLORS=$(grep -o 'fill=' $f | wc -l)
	if [[ COLORS -eq 2  ]]; then
		sed -i -r "s/$PATTERN/fill=\"${WHITE}\"/1" "$f"
		sed -i -r "s/$PATTERN/fill=\"${BLACK}\"/2" "$f"
	else # single color piece; only bP on current set
		sed -i -r "s/$PATTERN/fill=\"${BLACK}\"/1" "$f"
	fi
done
