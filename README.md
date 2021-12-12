- [Description](#description)
- [Quick Start](#quick-start)
  - [Front-end App](#front-end-app)
  - [CloudFlare Worker (Backend)](#cloudflare-worker-backend)

- Use https://github.com/danielroe/stream-vue for streaming
- Upload functionality

# Description

# Quick Start

## Front-end App

The default output directory is `./dist` (relative to project root), which will be used for our CloudFlare worker to serve our front-end app.

```
// install package
yarn 

// development
yarn dev 

// build
yarn build
```

## CloudFlare Worker (Backend)

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

// prod
wrangler kv:namespace create "LIT_KV"
```
