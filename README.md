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
  - [Login/signup page](#loginsignup-page)
  - [Sending a POST/GET Request](#sending-a-postget-request)
  - [User encryption](#user-encryption)
  - [User decryption](#user-decryption)
- [Limitations/Sponsors (If you would like to sponsor us going forward)](#limitationssponsors-if-you-would-like-to-sponsor-us-going-forward)

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

## Login/signup page

![](https://assets.wzac.io/lit-protocol/lit-login.jpeg)

## Sending a POST/GET Request

![](https://assets.wzac.io/lit-protocol/lit-request.jpeg)

## User encryption

![](https://assets.wzac.io/lit-protocol/lit-user-encryption.jpeg)

## User decryption

![](https://assets.wzac.io/lit-protocol/lit-user-encryption.jpeg)

# Limitations/Sponsors (If you would like to sponsor us going forward)

Here are some of the todos if we continue the project

1. Creator should be able to delete videos
2. ~~Creator should be able to update global api~~
3. ~~Show errors when email/globalAPI don't match~~
4. Delete video if upload unsuccessful (A direct upload URL will be created as a placeholder for creator to upload a video. If it fails to upload, the creator persists which will occupy extra storages (depending on your CloudFlare plan it might not be ideal.))
5. ~~Setup environment variables~~
6. ~~Make use of Lit JWT (npm package wasn't verified at the time of this project started)~~
   1. ~~It could be used to restrict access for certain APIs if user doesn't meet access control conditios.~~
7. ~~Make use of CloudFlare JWT for videos so authroized users cannot use copy the link to share it to unauthorized users.~~
