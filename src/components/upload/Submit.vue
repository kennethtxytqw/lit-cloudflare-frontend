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
    <div class="flex flex-col w-4/5 my-8">
      <label>Account Details</label>
      <div>
        <p class="font-light">E-Mail</p>
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
        <video class="w-48" :src="video"></video>
      </div>
    </div>
    <button
      class="
        bg-lit-primary
        text-white
        active:bg-purple-600
        font-bold
        uppercase
        text-sm
        px-6
        py-3
        rounded-xl
        shadow
        hover:shadow-lg
        outline-none
        focus:outline-none
        mr-1
        mb-1
        ease-linear
        transition-all
        duration-150
      "
      @click="postVideo"
    >
      Submit
    </button>
  </div>
</template>

<script>
import { getDecryptedString } from "../../crypto.js";

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
    };
  },
  methods: {
    async requestCloudflareDirectUploadAuth(email, globalAPI) {
      const url = `https://api.cloudflare.com/client/v4/accounts/9b47beba2f167662ac16b81572ee529d/stream/direct_upload`;

      // -- prepare request header
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Auth-Email": email,
          "X-Auth-Key": globalAPI,
        },
        body: JSON.stringify({
          maxDurationSeconds: 21600,
          requireSignedURLs: false,
        }),
      };

      // -- execute
      const res = await fetch(url, options);
      const result = await res.json();
      return result["result"]["uploadURL"];
    },
    async setReadable(acc) {
      console.log(acc);
      const proxyReadable = await accessControlToReadable(acc);
      const arr = proxyObjectToArray(proxyReadable);
      const joinedString = arr.join();
      this.readable = joinedString;
    },
    async getCredential() {
      this.encryptedCredential = localStorage["lit-encrypted-cred"];
      const decryptedString = await getDecryptedString(
        this.encryptedCredential
      );
      return JSON.parse(atob(decryptedString));
    },
    async postVideo() {
      console.log(this.video);

      const video = this.video;
      const formData = new FormData();
      formData.append("file", video);

      const options = {
        method: "POST",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        //   "X-Auth-Email": this.email,
        //   "X-Auth-Key": this.globalAPI,
        // },
        body: formData,
      };

      const oneTimeUploadUrl = await this.requestCloudflareDirectUploadAuth(
        this.email,
        this.globalAPI
      );
      console.log(oneTimeUploadUrl);
      const uploadResult = await fetch(oneTimeUploadUrl, options);

      console.log(uploadResult);
    },
  },
  async created() {
    this.setReadable(this.acc);
    const credential = await this.getCredential();
    console.log("🤌  Credential:", credential);
    this.email = credential.email;
    this.globalAPI = credential.global_api;
  },
};
</script>

