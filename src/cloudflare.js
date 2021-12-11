// curl \
// -H "X-Auth-Email: lightanson@protonmail.com" \
// -H "X-Auth-Key: 9e71cdc773da780e5059efe41ee0887d86b08" \
// -F 
// https://api.cloudflare.com/client/v4/accounts/9b47beba2f167662ac16b81572ee529d/stream

// curl -X GET  \
//     -H "X-Auth-Email: lightanson@protonmail.com" \
//     -H "X-Auth-Key: 9e71cdc773da780e5059efe41ee0887d86b08" \
//     "https://api.cloudflare.com/client/v4/accounts/9b47beba2f167662ac16b81572ee529d/stream"

// curl -X POST  \
//     -H "X-Auth-Email: lightanson@protonmail.com" \
//     -H "X-Auth-Key: 9e71cdc773da780e5059efe41ee0887d86b08" \
//     "https://api.cloudflare.com/client/v4/accounts/9b47beba2f167662ac16b81572ee529d/stream/direct_upload"

// https://api.cloudflare.com/client/v4/accounts <== Get account ID
// POST accounts/:account_identifier/stream/direct_upload <== Get direct up auth

export const requestCloudflareDirectUploadAuth = async (email, globalAPI, accountId) => {

    // -- prepare params
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`;

    // -- prepare request header
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Email': email,
            'X-Auth-Key': globalAPI,
        },
        body: JSON.stringify({
            maxDurationSeconds: 21600,
            requireSignedURLs: true,
        })
    };
    
    // -- execute
    const res = await fetch(url, options);
    const result = await res.json();
    
    // -- return
    return result['result']['uploadURL'];
}

export const getCloudFlareAccountId = async (email, globalAPI) =>  {

    // -- prepare params
    const url = `https://cf-worker.gtc-lightanson.workers.dev/account`;

    // -- prepare request header
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

// const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/9b47beba2f167662ac16b81572ee529d/stream/direct_upload`, {
//     method: "POST",
//     headers: {
//         'Content-Type': 'application/json',
//         'X-Auth-Email': "lightanson@protonmail.com",
//         'X-Auth-Key': "9e71cdc773da780e5059efe41ee0887d86b08",
//     },
//     body: JSON.stringify({
//         maxDurationSeconds: 21600,
//         requireSignedURLs: true,
//     })
// });

// const data = await res.json();

// console.log(data);