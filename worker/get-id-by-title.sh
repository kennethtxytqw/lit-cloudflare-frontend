#!/bin/bash          
# Reference: https://unix.stackexchange.com/questions/459805/how-to-retrieve-values-from-json-object-using-awk-or-sed

# ===== Arguments =====
NAMESPACE=$1
FILE=$2

# ===== Main =====
# Add new lines after ,
tr , '\n' < $FILE > tmp.txt

# Capture that line {"id":"","title":""}
OBJECT=$(grep -B1 -A0 '"title":"'$NAMESPACE'"' tmp.txt)

# get the value of the id
OBJECT_ID=$(echo $OBJECT | cut -d : -f2 | awk -F\" '{print $2}')
echo $OBJECT_ID;