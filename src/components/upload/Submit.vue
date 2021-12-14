<template>
  <div
    ref="container"
    class="
      bg-gray-50
      w-2/3
      rounded-b-3xl
      text-black
      font-semibold
      m-auto
      flex flex-col
      justify-center
      items-center
      transition-all
      
    "
  >
    <!-- requirements not met -->
    <div v-if="video == ''" class="h-48 flex">
      <p class="m-auto">Please upload a video</p>
    </div>

    <div v-else-if="acc == ''" class="h-48 flex">
      <p class="m-auto">Access control conditions not selected</p>
    </div>

    <!-- loading -->
    <div v-else-if="email == null">
      <div class="flex justify-center items-center">
        <div
          class="
            animate-spin
            rounded-full
            h-16
            w-16
            m-48
            border-t-2 border-b-2 border-purple-500
          "
        ></div>
      </div>
    </div>

    <!-- loaded -->
    <div v-else class="flex flex-col w-4/5 my-8">
      <label>CloudFlare account details</label>
      <div>
        <p class="font-light">Email</p>
        <p class="font-medium">{{ email }}</p>
      </div>

      <div class="mt-4">
        <p class="font-light">Global API</p>
        <p class="font-medium">
          {{ globalAPI }}
        </p>
      </div>

      <label class="mt-6">Video and access details</label>

      <div>
        <p class="font-light">
          User must meet the following conditions to unlock the video
        </p>
        <p class="font-medium">{{ readable }}</p>
      </div>

      <div class="mt-4">
        <p class="font-light">Video preview</p>
        <video class="w-48" :src="video.previewFileBlob"></video>
      </div>
    </div>

    <!-- progress bar -->
    <div
      v-if="email != null && video != '' && acc != ''"
      class="relative pt-1 w-full px-24"
    >
      <div class="flex mb-2 items-center justify-between">
        <span
          class="
            text-xs
            font-semibold
            inline-block
            py-1
            px-2
            rounded-full
            text-purple-600
            bg-purple-200
            uppercase
          "
          v-if="progressText != ''"
        >
          {{ progressText }}
        </span>
        <div class="text-right">
          <span class="text-xs font-semibold inline-block text-purple-600">
            {{ percentage }}%
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
        <div
          :style="{ width: percentage + '%' }"
          class="
            shadow-none
            flex flex-col
            text-center
            whitespace-nowrap
            text-white
            justify-center
            bg-purple-500
            transition-all
          "
        ></div>
      </div>
    </div>

    <!-- submit button -->
    <button
      v-if="email != null && video != '' && acc != '' && !videoUploaded"
      class="
        bg-lit-primary
        text-white
        active:bg-purple-600
        font-bold
        uppercase
        text-sm
        px-6
        mt-1
        py-3
        rounded-xl
        shadow
        hover:shadow-lg
        outline-none
        focus:outline-none
        mr-1
        mb-6
        ease-linear
        transition-all
        duration-150
      "
      @click="onSubmit"
    >
      {{
        percentage <= 0
          ? "Submit"
          : percentage >= 100
          ? "Done"
          : "Processing..."
      }}
    </button>

    <div v-else-if="videoUploaded">
      <button
        class="
          bg-lit-primary
          text-white
          active:bg-purple-600
          font-bold
          uppercase
          text-sm
          px-6
          mt-1
          py-3
          rounded-xl
          shadow
          hover:shadow-lg
          outline-none
          focus:outline-none
          mr-1
          mb-6
          ease-linear
          transition-all
          duration-150
        "
      >
        <router-link to="/">Watch Video</router-link>
      </button>
    </div>

    <!-- Generate Snippet -->
    <h1 v-if="videoUploaded" class="w-full h-1 border border-dashed mb-6 mt-6"></h1>
    <h1 v-if="videoUploaded" class="text-5xl mb-3">Snippets</h1>
    <div v-if="videoUploaded" class="lit-label">Copy the following snippets and paste it to your website, or anywhere you like!</div>
    <pre v-if="videoUploaded" id="js-lit-snippet-1" class="lit-snippet">{{ snippet1 }}</pre>
    <span v-if="videoUploaded" class="btn-copy" @click="copySnippet">Click to copy</span>
    <div v-if="videoUploaded" class="lit-label">Place the following script tags at the end of the body tag</div>
    <pre v-if="videoUploaded" id="js-lit-snippet-2" class="lit-snippet">{{ snippet2 }}</pre>
    <span v-if="videoUploaded" class="btn-copy pb-12" @click="copySnippet">Click to copy</span>
  </div>
</template>

<script>


import { blobToDataURI, makeId, proxyObjectToArray } from "../../utils";
import { getDecryptedString } from "../../crypto.js";
import {
  requestCloudflareDirectUploadAuth,
  getCloudFlareAccountId,
  saveZipToKVDB,
} from "../../cloudflare.js";

const accessControlToReadable = async (value) => {
  return await LitJsSdk.humanizeAccessControlConditions({
    accessControlConditions: value,
  });
};

const scriptTags = `<!SNIPPET! onload="LitJsSdk.litJsSdkLoadedInALIT()" src="https://jscdn.litgateway.com/index.web.js"></!SNIPPET!>
<!SNIPPET! src="https://cloudflare-lit-protocol-integration.vercel.app/lit-unlock.min.js"></!SNIPPET!>
<link rel="stylesheet" href="https://cloudflare-lit-protocol-integration.vercel.app/lit-unlock.min.css"></link>`;

export default {
  name: "AccessControl",
  props: ["acc", "video"],
  data() {
    return {
      readable: null,
      email: null,
      globalAPI: null,
      encryptedCredential: null,
      totalSteps: 9,
      progressSteps: 0,
      percentage: 0,
      progressText: "",
      videoUploaded: false,
      snippet1: '',
      snippet2: '',
    };
  },
  watch: {
    //
    // Update the percentage when progressSteps has changed
    //
    progressSteps: function (v1, v2) {
      this.percentage = Math.round(
        (this.progressSteps / this.totalSteps) * 100
      );
    },
  },
  methods: {
    //
    // set readable access control conditions
    // @params { Array } a list of accessControlConditions in an array
    // @returns { void }
    //
    async setReadable(acc) {
      console.log(acc);
      const proxyReadable = await accessControlToReadable(acc);
      const arr = proxyObjectToArray(proxyReadable);
      const joinedString = arr.join();
      this.readable = joinedString;
    },

    //
    // get credential from local storage
    // @params { Object } credential
    //
    async getCredential() {
      this.encryptedCredential = localStorage["lit-encrypted-cred"];
      const decryptedString = await getDecryptedString(
        this.encryptedCredential
      );
      return JSON.parse(atob(decryptedString));
    },

    //
    // Increment progress by 1 and update message each time it's called
    // @params { String } msg
    // @returns { void }
    //
    updateProgress(msg) {
      console.log(`🔥 ${msg}`);
      this.progressText = msg;
      this.progressSteps += 1;
    },

    //
    // Reset progress back to original state
    // @returns { void }
    //
    resetProgress() {
      this.progressText = "";
      this.progressSteps = 0;
    },

    //
    // When submit button is clicked, it will run a 9 steps pipeline that
    // consists of uploading a video to CloudFlare, encrypt the video
    // id to the lit-network, and finally save it to the database.
    // @returns { void }
    //
    async onSubmit() {
      
      this.resetProgress();
      const chain = "ethereum";

      // -- step 1
      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain });
      this.updateProgress("Lit-network authenticated");

      // -- step 2
      const formData = this.video.videoData;
      const email = this.email;
      const globalAPI = this.globalAPI;
      const accountId = await getCloudFlareAccountId(email, globalAPI);
      const accessControlConditions = this.acc;
      const NS_VIDEOS = DEBUG ? NS_VIDEO_DEV : NS_VIDEO_PROD;

      // --
      this.updateProgress(`Data Prepared`);

      // -- step 3
      const oneTimeUploadUrl = await requestCloudflareDirectUploadAuth(
        email,
        globalAPI,
        accountId
      );
      this.updateProgress("permission granted");

      // -- step 4
      const uploadResult = await fetch(oneTimeUploadUrl, {
        method: "POST",
        body: formData,
      });
      const videoId = uploadResult.url.split(
        "https://upload.videodelivery.net/"
      )[1];
      this.updateProgress(`Video uploaded: ${videoId} `);
      console.log(videoId);

      // -- step 5
      const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
        videoId
      );
      this.updateProgress(`Video encrypted`);

      // -- step 6
      const encryptedSymmetricKey =
        await window.litNodeClient.saveEncryptionKey({
          accessControlConditions, // array of objects [{}]
          symmetricKey, // Unit8Array string
          authSig, // object
          chain, // string
        });
      this.updateProgress(`Saved encryption key to lit-network`);

      // -- step 7
      const encryptedSymmetricKey_string = btoa(encryptedSymmetricKey);
      const encryptedZip_dataURI = await blobToDataURI(encryptedZip);
      this.updateProgress(`Retrived encryptedZip`);

      // -- step 8
      const dataToBeSaved = btoa(
        JSON.stringify({
          accessControlConditions: btoa(
            JSON.stringify(accessControlConditions)
          ),
          encryptedZip: encryptedZip_dataURI,
          encryptedSymmetricKey: encryptedSymmetricKey_string,
        })
      );

      const dbKey =
        window.ethereum.selectedAddress +
        ":" +
        accountId +
        ":" +
        NS_VIDEOS +
        ":" +
        makeId(12);
      const saveVideoResponse = await saveZipToKVDB(dbKey, dataToBeSaved);
      console.log(saveVideoResponse);
      this.updateProgress(`Saved to CloudFlare KV Database`);

      // -- step 9
      await new Promise((r) => setTimeout(r, 2000));
      this.snippet1 = this.getSnippet(this.readable, dataToBeSaved);
      this.snippet2 = scriptTags.replaceAll('!SNIPPET!', 'script');
      this.updateProgress(`Done`);
      this.videoUploaded = true;
      
      await new Promise((r) => setTimeout(r, 2000));
      window.scrollTo(0,document.body.scrollHeight);
    },
    // 
    // Copy snippet
    // @returns { void } 
    //
    copySnippet(e){
      const snippet = e.target.previousElementSibling.innerText;
      navigator.clipboard.writeText(snippet).then(() => {
      console.log('Async: Copying to clipboard was successful!');

          e.target.innerText = 'Copied text to clipboard';

          setTimeout(() => {
              e.target.innerText = 'Click to copy';
          }, 2000);

      }, (err) => {
          console.error('Async: Could not copy text: ', err);
      });
    },

    // 
    // Generate a snippet
    // @params { String } readable of access control conditions
    // @params { String } data
    // @returns { String } snippet
    //
    getSnippet(readable, data) {
          return `<div class="lit-video-wrapper">
        <iframe 
            src=""
            class="lit-video"
            allow="accelerometer; gyroscope; 
            autoplay; encrypted-media; 
            picture-in-picture;" 
            allowfullscreen="true"
            data-readable-conditions="${readable}"
            data-lit="${data}">
        </iframe>
        <button class="btn-lit-video-unlock">🔥  Unlock with Lit-Protocol</button>
    </div>
    `;
        },
  },


  //
  // Set the readable version of the accessControlCondition when component
  // is created. Then we will get the credential from localStorage if it exists,
  // otherwise, we will get it from the database. Finally, we will set the
  // email and globalAPI variables required for this component
  //
  async created() {
    this.setReadable(this.acc);
    const credential = await this.getCredential();
    // console.log("🤌  Credential:", credential);
    console.log(this.email);
    this.globalAPI = credential.global_api;
    this.email = credential.email;
  },
};
</script>

<style>
.lit-snippet{
  background-color: #f2f2f2;
  border: 1px solid #d9d9d9;
  font-family: monaco, courier, monospace;
  width: 100%;
  max-width: 80%;
  border-radius: 3px;
  color: #313131;
  display: block;
  font-size: 14px;
  overflow: auto;
  padding: 0.5rem;
}
.btn-copy{
  font-size: 12px;
  color: rgb(61, 61, 61);
  max-width: 80%;
  width: 100%;
  margin-top: 2px;
  cursor: pointer;
}
.lit-label{
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.35938em;
  min-height: 1.2em;
  width: 100%;
  max-width: 80%;
}
</style>