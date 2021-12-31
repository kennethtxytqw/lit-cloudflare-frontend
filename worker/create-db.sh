#!/bin/bash          

# ===== Arguments =====
# $1: @param WORKER_NAME
# $2: @param CLOUDFLARE_ACCOUNT_ID
# $3: @param CLOUDFLARE_EMAIL
# $4: @param CLOUDFLARE_GLOBAL_API
# $5: @param CLOUDFLARE_WHITE_LIST
# Sample Command: 
# ./create-db.sh cicd 9b47beba2f167662ac16b81572ee529d lightanson@protonmail.com 9e71cdc773da780e5059efe41ee0887d86b08 cf-worker.gtc-lightanson.workers.dev,127.0.0.1,localhost
# 

# -- Create wrangler.toml using the example
FILE=wrangler.toml

# -- Clone example to main
cp wrangler.example.toml $FILE

# -- Set variables
sed -i -e 's/<WORKER_NAME>/'$1'/gI' $FILE
sed -i -e "s/<CLOUDFLARE_ACCOUNT_ID>/$2/gI" $FILE
sed -i -e "s/<CLOUDFLARE_EMAIL>/$3/gI" $FILE
sed -i -e "s/<CLOUDFLARE_GLOBAL_API>/$4/gI" $FILE
sed -i -e "s/<CLOUDFLARE_WHITE_LIST>/$5/gI" $FILE

# -- Create a KV called VIDEOS and save its input to wrangler.toml
yarn wrangler kv:namespace create "VIDEOS" > temp_binding.txt
NAMESPACE_BINDING_1=$(sed -n '6p' < temp_binding.txt)
sed -i -e "s/{binding='',id=''}/$NAMESPACE_BINDING_1/gI" $FILE
cat temp_binding.txt