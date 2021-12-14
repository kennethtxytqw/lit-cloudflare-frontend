//
// (POST) Request a one-time upload url to upload video
// accounts/:account_identifier/stream/direct_upload
// @param { String } email
// @param { String } globalAPI
// @param { String } accountId
// @returns { String } uploadURL
//
export const requestCloudflareDirectUploadAuth = async (email, globalAPI, accountId) => {

    // -- prepare params
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`;

    // -- prepare
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Email': email,
            'X-Auth-Key': globalAPI,
        },
        body: JSON.stringify({
            maxDurationSeconds: 21600,
            requireSignedURLs: false,
        })
    };
    
    // -- execute
    const res = await fetch(url, options);
    const result = await res.json();
    
    // -- return
    return result['result']['uploadURL'];
}

//
// (POST) Get CloudFlare account id so that we can use it to request 
// from GET https://api.cloudflare.com/client/v4/accounts
// other APIs on CloudFlare 
// @param { String } email
// @paarm { String } globalAPI
// @returns { String } accountId
//
export const getCloudFlareAccountId = async (email, globalAPI) =>  {

    // -- prepare params
    const url = `${API_PROD}/account`;

    // -- prepare
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            email,
            globalAPI
        })
    };
    
    // // -- execute
    const res = await fetch(url, options);
    const result = await res.json();
    const accountId = result.id;
    
    // // -- return
    return accountId;
}

//
// (POST) Save new video to VIDEO KV
// @param { String } id
// @param { String } value
// @returns { Object } JSON 
//
export const saveZipToKVDB = async (id, value) => {
    
    // -- prepare
    const debugURL = `${API_DEV}/newvideo`;
    const prodURL = `${API_PROD}/newvideo`;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: id,
            value: value,
        })
    };

    // -- execute
    const url = DEBUG ? debugURL : prodURL; 
    const res = await fetch(url, options);
    const result = await res.json();
    return result;
}

//
// (GET) Get all videos from namespace VIDEOS from CloudFlare KV Database
// @returns { Object } JSON 
//
export const getCloudFlareVideos = async () => {
    console.log("Get CloudFlare Videos");
    
    // -- prepare
    const debugURL = `${API_DEV}/api/videos`;
    const prodURL = `${API_PROD}/api/videos`;
    const url = DEBUG ? debugURL : prodURL;

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    // -- execute
    const res = await fetch(url, options);
    const result = await res.json();
    return result;
}

//
// (POST) Get value from key
// @params { String } key : the key of the KV database
// @returns { Object } JSON 
//
export const getCloudFlareValueFromKey = async (key) => {
    // -- prepare
    const debugURL = `${API_DEV}/api/videos`;
    const prodURL = `${API_PROD}/api/videos`;
    const url = DEBUG ? debugURL : prodURL;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            key,
        })
    };

    // -- execute
    const res = await fetch(url, options);
    const result = await res.json();
    return result;
}