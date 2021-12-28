//
// turn blob data to data URI
// @param { Blob } blob
// @return { Promise<String> } blob data in data URI
//
export const blobToDataURI = (blob) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = (e) => {
        var data = e.target.result;
        resolve(data);
        };
        reader.readAsDataURL(blob);
    });
}

//
// convert data URI to blob
// @param { String } dataURI
// @return { Blob } blob object
//
export const dataURItoBlob = (dataURI) => {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}

//
// Turn file into blob
// @param { File } file to be converted 
// @returns { Promise<Blob> } use await to get result
//
export const fileToBlob = (file) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = (e) => {
            var data = e.target.result;
            console.log(e.target);
            resolve(data);
        };
        reader.readAsDataURL(file);
    });
}

//
// Generate an unique id based on length
// @param { Int } length of the random string
// @returns { String } random string
export const makeId = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

// 
// Convert array string string 1,2,3,4,5 to Unit8Array
// @param { String } string array
// @returns { Unit8Array } array
//
export const arrayStringToUnit8Array = (value) =>{
    return new Uint8Array(atob(value).split(',').map((x) => parseInt(x)));
}

// 
// Convert Unit8Array to hex tring
// @param { Unit8Array } buffer
// @returns { String } hex value of the unit8array
//
export const buf2hex = (buffer) => {
    // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
}

//
// Convert proxy object to array
// @param { Object<Proxy> } 
// @returns { Array } 
//
export const proxyObjectToArray = (proxyObject) => {
    return JSON.parse(JSON.stringify(proxyObject));
}