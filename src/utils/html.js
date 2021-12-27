// 
// Inject external javascript into component
// @param { String } path
// @returns { void } 
//
export const injectJS = (path) => {
    var tag = document.createElement("script");
    tag.setAttribute("src", path);
    document.head.appendChild(tag);
}

// 
// Inject external CSS into component
// @param { String } path
// @returns { void } 
//
export const injectCSS = (path) => {
    var tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute("href", path);
    document.head.appendChild(tag);
}