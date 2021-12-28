# DEMO
https://cf-worker.gtc-lightanson.workers.dev/

# VIDEO
https://www.youtube.com/watch?v=rxA1hH20-FQ

# Table of Contents
- [DEMO](#demo)
- [VIDEO](#video)
- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Front-end App](#front-end-app)
- [CloudFlare Worker (Backend)](#cloudflare-worker-backend)
  - [API Endpoints](#api-endpoints)
- [Diagrams](#diagrams)
  - [JWT Integration](#jwt-integration)
- [Todo list](#todo-list)
    - [[COMPLETED 28-12-21]](#completed-28-12-21)

# Description
This platform allows creators to encrypt videos using the Lit-SDK, verifying using the CloudFlare worker, and storing the encrypted data into the CloudFlare key value database. Then, showing all the encrypted videos on the home page in which users will have to unlock it based on the on-chain conditions. 

In addition,we have also allowed users to copy/paste video snippets to their website, or any websites when the video is uploaded. To complement this feature, we have created a browser extension that allows user to encrypt their videos right in the CloudFlare dashboard, without needing to use the platform at all. 

# Front-end App

The default output directory is `./dist` (relative to project root), which will be used for our CloudFlare worker to serve our front-end app. When it is built for deployment, make sure to turn `DEBUG` to `false` in the `vite.config.js` file.

```
// install package
yarn 

// development
yarn dev 

// build 
yarn build

// deploy - turn debug to false in the vite.config.js file, build and wrangler publish, then turn debug back to true
yarn deploy
```

# CloudFlare Worker (Backend)

You will need to update the `wrangler.toml` config file, specifically your `account_id`, `site`, and `kv_namespaces`

Run development server

```
wrangler dev
```

Deploy

```
wrangler publish
```

Setup a key/value database

```
// dev
wrangler kv:namespace create "LIT_KV" --preview
wrangler kv:namespace create "VIDEOS" --preview

// prod
wrangler kv:namespace create "LIT_KV"
wrangler kv:namespace create "VIDEOS" 

```

## API Endpoints
- `GET /wallet/${walletAddress}`
- `POST /wallet/${walletAddress}`
- `POST /api/new_video` Add new video to `VIDEOS` KV
- `GET /api/videos` return all videos’ key from `VIDEOS` KV
- `POST /api/videos` return data of that particular video id
- `GET /api/get_direct_upload_auth`
- `GET /api/video_id` return signed video id

# Diagrams

## JWT Integration

![](https://assets.wzac.io/lit-protocol/lit-cloudflare-jwt-integration.jpeg)

# Todo list

Here are some of the todos if we continue the project

1. Creator should be able to delete videos
2. Delete video if upload unsuccessful (A direct upload URL will be created as a placeholder for creator to upload a video. If it fails to upload, the creator persists which will occupy extra storages (depending on your CloudFlare plan it might not be ideal.))

### [COMPLETED 28-12-21]

1. Setup environment variables
   1. Add `.env` variables
   2. Update `wrangler.toml` env
   3. Add `yarn deploy` command
2. Integrate JWT with signed URL
3. Remove `Authenticated page`