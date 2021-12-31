//
// (POST) Request a one-time upload url to upload video
// accounts/:account_identifier/stream/direct_upload
// @returns { String } uploadURL
//
export const requestCloudflareDirectUploadAuth = async () => {

    // -- prepare
    const debugURL = `${API_DEV}/api/get_direct_upload_auth`;
    const prodURL = `${window.location.origin}/api/get_direct_upload_auth`;
    const url = DEBUG ? debugURL : prodURL;

    console.log("Direct: ", url);

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
// (POST) Save new video to VIDEO KV
// @param { String } id
// @param { String } value
// @returns { Object } JSON 
//
export const saveZipToKVDB = async (id, value) => {
    
    // -- prepare
    const debugURL = `${API_DEV}/api/new_video`;
    const prodURL = `${window.location.origin}/api/new_video`;

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
    const prodURL = `${window.location.origin}/api/videos`;
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
// @param { String } key : the key of the KV database
// @returns { Object } JSON 
//
export const getCloudFlareValueFromKey = async (key) => {
    // -- prepare
    const debugURL = `${API_DEV}/api/videos`;
    const prodURL = `${window.location.origin}/api/videos`;
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