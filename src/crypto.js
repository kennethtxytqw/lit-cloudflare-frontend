import { buf2hex, dataURItoBlob } from "./utils";

//
// Decrypt the encrypted base64 string credential
// @params { String } base64 of "{email:'', globalAPI: ''}"
// @returns { String } "{email:'', globalAPI: ''}"
//
export const getDecryptedString = async (base64EncryptedCredential) => {
    
    const chain = 'ethereum';
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain});

    const res = JSON.parse(atob(base64EncryptedCredential));
    const accessControlConditions = res.accessControlConditions;
    const toDecrypt = buf2hex(new Uint8Array(atob(res.encryptedSymmetricKey).split(',').map((x) => parseInt(x))));
    const encryptedZip = dataURItoBlob(res.encryptedZip)

    await new Promise(r => setTimeout(r, 1000));
    const decryptedSymmetricKey = await window.litNodeClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt,
        chain,
        authSig
    });

    const decryptedFiles = await LitJsSdk.decryptZip(encryptedZip, decryptedSymmetricKey);
    const decryptedString = await decryptedFiles["string.txt"].async("text");

    return decryptedString;
}