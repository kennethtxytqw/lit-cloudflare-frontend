#!/bin/bash
# bash ./set-namespace.sh test2.txt cicd-TEST tmp_namespaces.txt wrangler.example.toml
FILE_TEMP_BINDING=$1
NAMESPACE=$2
FILE_NAMESPACES="tmp_namespaces.txt"
FILE=$3

# Check if file has the string "Success"
count=$(cat "$FILE_TEMP_BINDING" | sed -n "/\Success/p" | wc -l)
echo $count;

# Created a namespace already
if [ $count -gt 0 ]; then
    echo "👉 Found namespace"
    BINDING="{$(sed -n "s/^.*{\(.*\)}.*$/\1/ p" temp_binding.txt)}"
    sed -i -e "s/{binding='',id=''}/$BINDING/gI" $FILE
# If namespace already exist
else
    echo "👉 Namespace already exist"
    

    # (method) list all namespaces into a file
    echo "👉 ...Get namespace list"
    CF_EMAIL=$4 CF_API_KEY=$5 yarn wrangler kv:namespace list > $FILE_NAMESPACES
    cat $FILE_NAMESPACES
    
    # (method) get id by title
    echo "👉 ...Get the id by title"
    ID=$(sh ./get-id-by-title.sh $NAMESPACE $FILE_NAMESPACES)

    echo "👉 ...ID: $ID" 
    BINDING='{ binding = "VIDEOS", id = "'$ID'"}'
    echo "👉 ...BINDING: $BINDING" 
    
    sed -i -e "s/{binding='',id=''}/$BINDING/gI" $FILE

    cat temp_binding.txt
fi