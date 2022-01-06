//
// Generate a snippet
// @param { String } readable of access control conditions
// @param { String } data
// @returns { String } snippet
//
export const getSnippet1 = (readable, data) => {
  return `<div class="lit-video-wrapper">
    <iframe 
        src=""
        class="lit-video"
        allow="accelerometer; gyroscope; 
        autoplay; encrypted-media; 
        picture-in-picture;" 
        allowfullscreen="true"
        data-server="${window.location.origin}"
        data-readable-conditions="${readable}"
        data-lit="${data}">
    </iframe>
    <button class="btn-lit-video-unlock">🔥  Unlock with Lit-Protocol</button>
</div>
`;
};

const scriptTags = `<!SNIPPET! onload="LitJsSdk.litJsSdkLoadedInALIT()" src="https://jscdn.litgateway.com/index.web.js"></!SNIPPET!>
<!SNIPPET! src="https://cloudflare-unlock-sdk-js-cdn.litgateway.com/0.0.1/lit-unlock.min.js"></!SNIPPET!>
<link rel="stylesheet" href="https://cloudflare-unlock-sdk-js-cdn.litgateway.com/0.0.1/lit-unlock.min.css"></link>`;

export const getSnippet2 = () => scriptTags.replaceAll("!SNIPPET!", "script");
