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
    <div v-if="uploadedData == null" class="h-48 flex">
      <p class="m-auto">Please upload a stream</p>
    </div>

    <div v-else-if="acc == ''" class="h-48 flex">
      <p class="m-auto">Access control conditions not selected</p>
    </div>

    <!-- loaded -->
    <div v-else class="flex flex-col w-4/5 my-8">
      <h1 class="mt-6 text-xl mb-2">Video and access details</h1>

      <div>
        <p class="font-light">
          User must meet the following conditions to unlock the video
        </p>
        <p class="font-medium">{{ readable }}</p>
      </div>

      <div v-if="uploadedData.streamType == 'Videos'" class="mt-4">
        <p class="font-light">Video preview</p>
        <video class="w-48" :src="uploadedData.previewFileBlob"></video>
      </div>

      <div v-if="uploadedData.streamType == 'Live Inputs'" class="mt-4">
        <p class="font-light">
          Make sure you are prepared for your live stream!

          <table class="table-auto m-auto w-full mt-3">
            <!-- row -->
            <tr class="bg-gray-100">
              <td class="border px-4 py-2">RTMP Url</td>
              <td class="border px-4 py-2 text-right">
                <input readonly :value="uploadedData.streamData.url" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="12345678901234567890">
              </td>
            </tr>

            <!-- row -->
            <tr class="bg-gray-100">
              <td class="border px-4 py-2">RTMP Stream Key</td>
              <td class="border px-4 py-2 text-right">
                <input readonly :value="uploadedData.streamData.streamKey" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="12345678901234567890">
              </td>
            </tr>
          </table>
        </p>
      </div>

    </div>

    <!-- progress bar -->
    <div v-if="acc != ''" class="relative pt-1 w-full px-24">
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
      v-if="acc != '' && !videoUploaded"
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
    <h1
      v-if="videoUploaded"
      class="w-full h-1 border border-dashed mb-6 mt-6"
    ></h1>
    <h1 v-if="videoUploaded" class="text-5xl mb-3">Snippets</h1>
    <div v-if="videoUploaded" class="lit-label">
      Copy the following snippets and paste it to your website, or anywhere you
      like!
    </div>
    <pre v-if="videoUploaded" id="js-lit-snippet-1" class="lit-snippet">{{
      snippet1
    }}</pre>
    <span v-if="videoUploaded" class="btn-copy" @click="copySnippet"
      >Click to copy</span
    >
    <div v-if="videoUploaded" class="lit-label">
      Place the following script tags at the end of the body tag
    </div>
    <pre v-if="videoUploaded" id="js-lit-snippet-2" class="lit-snippet">{{
      snippet2
    }}</pre>
    <span v-if="videoUploaded" class="btn-copy pb-12" @click="copySnippet"
      >Click to copy</span
    >
  </div>
</template>

<script>
import {
  blobToDataURI,
  makeId,
  proxyObjectToArray,
} from "../../utils/utils.js";
import { getDecryptedString } from "../../utils/crypto.js";
import {
  requestCloudflareDirectUploadAuth,
  saveZipToKVDB,
} from "../../utils/cloudflare.js";
import { getSnippet1, getSnippet2 } from "../../utils/snippets.js";

export default {
  name: "AccessControl",
  props: ["acc", "uploadedData"],
  data() {
    return {
      readable: null,
      encryptedCredential: null,
      // totalSteps: 7,
      progressSteps: 0,
      percentage: 0,
      progressText: "",
      videoUploaded: false,
      snippet1: "",
      snippet2: "",
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
  computed:{
    totalSteps: function(){
      return this.uploadedData.streamType == 'Videos' ? 7 : 5;
    }
  },
  methods: {
    //
    // set readable access control conditions
    // @param { Array } a list of accessControlConditions in an array
    // @returns { void }
    //
    async setReadable(acc) {
      console.log(acc);
      // const proxyReadable = await LitJsSdk.humanizeAccessControlConditions({
      //   accessControlConditions: acc,
      // });
      // // const proxyReadable = await accessControlToReadable(acc);
      // const arr = proxyObjectToArray(proxyReadable);
      // const joinedString = arr.join();
      // this.readable = joinedString;
      this.readable = await LitJsSdk.humanizeAccessControlConditions({
        accessControlConditions: acc,
      });
    },

    //
    // Increment progress by 1 and update message each time it's called
    // @param { String } msg
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

      if(this.uploadedData.streamType == 'Videos'){
        this.runVideosPipeline();
        return;
      }

      if(this.uploadedData.streamType == 'Live Inputs'){
        this.runLiveInputsPipeline();
        return;
      }
    },

    //
    // Only run this method for stream type == 'Videos'
    // @returns { void } 
    //
    async runVideosPipeline(){
      
      const chain = "solana";

      // -- step 1
      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain });
      this.updateProgress("Lit-network authenticated");

      // -- step 2
      const formData = this.uploadedData.videoData;
      const accessControlConditions = this.acc;
      this.updateProgress(`Data Prepared`);

      // -- step 3
      const oneTimeUploadUrl = await requestCloudflareDirectUploadAuth();
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

      // -- step 5
      const baseUrl = window.location.host;

      const resourceId = {
        baseUrl: baseUrl,
        path: `/${videoId}`,
        orgId: "",
        role: "",
        extraData: ""
      }
      console.log("resourceId:", resourceId);
      
      const signedResource = await litNodeClient.saveSigningCondition({
        accessControlConditions,
        chain,
        authSig,
        resourceId,
      });

      console.log("SignedResource:", signedResource);
      this.updateProgress(`Resource signed`);

      // -- step 6
      const resourceId_base64 = btoa(JSON.stringify(resourceId));
      const dataToBeSaved = btoa(
        JSON.stringify({
          accessControlConditions: btoa(
            JSON.stringify(accessControlConditions)
          ),
          resourceId_base64,
        })
      );

      console.log("ResourceId:", resourceId);
      console.log("ResourceId base64:", resourceId_base64);
      console.log("dataToBeSaved:", dataToBeSaved);

      const dbKey = window.solana.selectedAddress + ":" + makeId(12);
      const saveVideoResponse = await saveZipToKVDB(dbKey, dataToBeSaved);
      console.log(saveVideoResponse);
      this.updateProgress(`Saved to CloudFlare KV Database`);

      // -- step 7
      await new Promise((r) => setTimeout(r, 2000));
      this.snippet1 = getSnippet1(this.readable, dataToBeSaved);
      this.snippet2 = getSnippet2();
      this.updateProgress(`Done`);
      this.videoUploaded = true;

      await new Promise((r) => setTimeout(r, 2000));
      window.scrollTo(0, document.body.scrollHeight);
    },

    //
    // Only run this method for stream type == 'Live Inputs'
    // @returns { void } 
    //
    async runLiveInputsPipeline(){
      const chain = "solana";

      // -- step 1
      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain });
      this.updateProgress(`Lit-network authenticated: ${chain}`);

      // -- step 2
      const accessControlConditions = this.acc;
      const live_input_uid = this.uploadedData.streamData['live_input_uid'];
      this.updateProgress(`Data Prepared: ${live_input_uid}`);
      
      // -- step 3
      const baseUrl = (window.location.host).split(':')[0];

      const resourceId = {
        baseUrl: baseUrl,
        path: `/${live_input_uid}`,
        orgId: "",
        role: "",
        extraData: "live"
      }
      
      const signedResource = await litNodeClient.saveSigningCondition({
        accessControlConditions, 
        chain, 
        authSig, 
        resourceId 
      })

      this.updateProgress(`Resource signed: ${JSON.stringify(resourceId)}`);


      // -- step 4
      const resourceId_base64 = btoa(JSON.stringify(resourceId));
      const dataToBeSaved = btoa(
        JSON.stringify({
          accessControlConditions: btoa(
            JSON.stringify(accessControlConditions)
          ),
          resourceId_base64
        })
      );

      console.log("ResourceId:", resourceId);
      console.log("ResourceId base64:", resourceId_base64);
      console.log("dataToBeSaved:", dataToBeSaved);

      const dbKey = window.solana.selectedAddress + ":" + makeId(12);
      const saveVideoResponse = await saveZipToKVDB(dbKey, dataToBeSaved);
      console.log(saveVideoResponse);
      this.updateProgress(`Saved to CloudFlare KV Database`);

      // -- step 5
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
    copySnippet(e) {
      const snippet = e.target.previousElementSibling.innerText;
      navigator.clipboard.writeText(snippet).then(
        () => {
          console.log("Async: Copying to clipboard was successful!");

          e.target.innerText = "Copied text to clipboard";

          setTimeout(() => {
            e.target.innerText = "Click to copy";
          }, 2000);
        },
        (err) => {
          console.error("Async: Could not copy text: ", err);
        }
      );
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
    // const credential = await this.getCredential();
    // console.log("🤌  Credential:", credential);
    // console.log(this.email);
    // this.globalAPI = credential.global_api;
    // this.email = credential.email;
  },
};
</script>

<style>
.lit-snippet {
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
.btn-copy {
  font-size: 12px;
  color: rgb(61, 61, 61);
  max-width: 80%;
  width: 100%;
  margin-top: 2px;
  cursor: pointer;
}
.lit-label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.35938em;
  min-height: 1.2em;
  width: 100%;
  max-width: 80%;
}
</style>
