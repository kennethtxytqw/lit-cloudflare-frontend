- [Description](#description)
- [Quick Start](#quick-start)
  - [Front-end App](#front-end-app)
  - [CloudFlare Worker (Backend)](#cloudflare-worker-backend)
- [Limitations/Sponsors (If you would like to sponsor us going forward)](#limitationssponsors-if-you-would-like-to-sponsor-us-going-forward)

- Use https://github.com/danielroe/stream-vue for streaming
- Upload functionality

# Description

# Quick Start

## Front-end App

The default output directory is `./dist` (relative to project root), which will be used for our CloudFlare worker to serve our front-end app. When it is built for deployment, make sure to turn `DEBUG` to `false` in the `vite.config.js` file.

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

# Limitations/Sponsors (If you would like to sponsor us going forward)

Here are some of the todos if we continue the project

1. Creator should be able to delete videos
2. Creator should be able to update global api
3. Show errors when email/globalAPI don't match
4. Delete video if upload unsuccessful (The direct upload URL will create a placeholder which occupies storage)