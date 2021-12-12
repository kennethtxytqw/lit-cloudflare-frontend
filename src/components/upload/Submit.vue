<template>
  <div
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
    <div v-if="email != null && video != '' && acc != ''" class="relative pt-1 w-full px-24">
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
          :style="{width: percentage + '%'}"
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
    <button v-if="email != null && video != '' && acc != ''"
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
      @click="postVideo"
    >
      Submit
    </button>

    

    <!-- Progress bar -->


  </div>
</template>

<script>
import { blobToDataURI } from '../../utils';
import { getDecryptedString } from "../../crypto.js";
import { requestCloudflareDirectUploadAuth, getCloudFlareAccountId } from '../../cloudflare.js';

const proxyObjectToArray = (proxyObject) => {
  const arr = JSON.parse(JSON.stringify(proxyObject));
  return arr;
};

const accessControlToReadable = async (value) => {
  return await LitJsSdk.humanizeAccessControlConditions({
    accessControlConditions: value,
  });
};

export default {
  name: "AccessControl",
  props: ["acc", "video"],
  data() {
    return {
      readable: null,
      email: null,
      globalAPI: null,
      encryptedCredential: null,
      totalSteps: 10,
      progressSteps: 0,
      percentage: 0,
      progressText: '',
    };
  },
  watch:{
    progressSteps: function(v1, v2){
      this.percentage = (this.progressSteps / this.totalSteps) * 100;
    }
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

    updateProgress(msg){
      console.log(`🔥 ${msg}`);
      this.progressText = msg;
      this.progressSteps += 1;
    },

    resetProgress(){
      this.progressText = '';
      this.progressSteps = 0;
    },

    //
    // submit video
    //
    async postVideo() {
      this.resetProgress();
      const chain = 'ethereum';

      // -- step 1
      const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain});
      this.updateProgress('Lit-network authenticated');
      
      // -- step 2
      const formData = this.video.videoData;
      const email = this.email;
      const globalAPI = this.globalAPI;
      const accountId = await getCloudFlareAccountId(email, globalAPI);
      const accessControlConditions = this.acc;
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
      const videoId = uploadResult.url.split('https://upload.videodelivery.net/')[1];
      this.updateProgress(`Video uploaded: ${videoId} `);
      console.log(videoId);

      // -- step 5
      const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(videoId);
      this.updateProgress(`Video encrypted`);

      // -- step 6
      const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
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
      const dataToBeSaved = btoa(JSON.stringify({
          accessControlConditions,
          encryptedZip,
          encryptedSymmetricKey: encryptedSymmetricKey_string,
      }));

      // ACTION TO SAVE TO DB
      // saveZipToKVDB(walletAddress, dataToBeSaved)
      this.updateProgress(`Saved to CloudFlare KV Database`);
      
    },
  },
  async created() {
    this.setReadable(this.acc);
    const credential = await this.getCredential();
    console.log("🤌  Credential:", credential);
    this.email = credential.email;
    this.globalAPI = credential.global_api;
  },
  // beforeRouteLeave (to, from , next) {
  //   const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  //   if (answer) {
  //     next()
  //   } else {
  //     next(false)
  //   }
  // }
};
</script>

