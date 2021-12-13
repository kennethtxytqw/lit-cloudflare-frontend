# Table of Contents
- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Front-end App](#front-end-app)
- [CloudFlare Worker (Backend)](#cloudflare-worker-backend)
- [Limitations/Sponsors (If you would like to sponsor us going forward)](#limitationssponsors-if-you-would-like-to-sponsor-us-going-forward)
- [Diagrams](#diagrams)
  - [Login/signup page](#loginsignup-page)
  - [Sending a POST/GET Request](#sending-a-postget-request)
  - [User encryption](#user-encryption)
  - [User decryption](#user-decryption)

- Use https://github.com/danielroe/stream-vue for streaming
- Upload functionality

# Description

# Front-end App

The default output directory is `./dist` (relative to project root), which will be used for our CloudFlare worker to serve our front-end app. When it is built for deployment, make sure to turn `DEBUG` to `false` in the `vite.config.js` file.

```
// install package
yarn 

// development
yarn dev 

// build 
yarn build
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

# Limitations/Sponsors (If you would like to sponsor us going forward)

Here are some of the todos if we continue the project

1. Creator should be able to delete videos
2. Creator should be able to update global api
3. Show errors when email/globalAPI don't match
4. Delete video if upload unsuccessful (The direct upload URL will create a placeholder which occupies storage)
5. Setup environment variables 

# Diagrams

## Login/signup page

![](https://assets.wzac.io/lit-protocol/lit-login.jpeg)

## Sending a POST/GET Request

![](https://assets.wzac.io/lit-protocol/lit-request.jpeg)

## User encryption

![](https://assets.wzac.io/lit-protocol/lit-user-encryption.jpeg)

## User decryption

![](https://assets.wzac.io/lit-protocol/lit-user-encryption.jpeg)
