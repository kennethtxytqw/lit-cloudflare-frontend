import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {

  const url = new URL(event.request.url)
  const path = url.pathname;

  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)
  

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }

    // If path is /wallet
    if((path.match(/\/wallet\/.+$/) || [])[0] === path){

      // -- prepare
      const walletAddress = path.split('/')[2];
      const method = event.request['method'];
      const credential = await LIT_KV.get(walletAddress);
      
      const header = {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
          // "Access-Control-Max-Age": "86400",
        }
      };

      // -- handle GET request
      if(method == 'GET'){
        const jsonData = JSON.stringify({
          method: event.request['method'],
          walletAddress: walletAddress,
          kv: credential, 
        }, null, 2)

        return new Response(jsonData, header);
      }

      // -- handle POST request
      if(method == 'POST'){
        
        // If there record for this wallet address
        if(credential != null){
          const jsonData = JSON.stringify({
            error: "Wallet Exist",
          });
          return new Response(jsonData, header);
        }

        // If no record was found for this wallet address
        const encryptedCredential = await event.request.url.split('?c=')[1];

        // If the size of the data is less than 1000 characters
        if(encryptedCredential.length < 1000){
          const jsonData = JSON.stringify({
            error: "requirements not met.",
          }, null, 2);
  
          return new Response(jsonData, header);
        }

        // insert new entry to db
        await LIT_KV.put(walletAddress, encryptedCredential);

        const jsonData = JSON.stringify({
          method: event.request['method'],
          walletAddress: walletAddress,
          kv: encryptedCredential,
        }, null, 2);

        return new Response(jsonData, header);

      }
    }
    

    const page = await getAssetFromKV(event, options);

    // allow headers to be altered
    const response = new Response(page.body, page);

    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "unsafe-url");
    response.headers.set("Feature-Policy", "none");

    return response;

  } catch (e) {
    // https://stackoverflow.com/a/58439234
    // Fall back to serving `/index.html` on errors.
    return getAssetFromKV(event, {
      mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
    })
  }
}

/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
 async function readRequestBody(request) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return JSON.stringify(await request.json())
  }
  else if (contentType.includes("application/text")) {
    return request.text()
  }
  else if (contentType.includes("text/html")) {
    return request.text()
  }
  else if (contentType.includes("form")) {
    const formData = await request.formData()
    const body = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    return JSON.stringify(body)
  }
  else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data. 
    return 'a file';
  }
}


/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return request => {

    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}