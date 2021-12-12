<template>
  <div class="bg-gray-50 w-2/3 rounded-b-3xl text-white font-semibold m-auto">
    <div class="bg-gray-50 p7 w-9/12 mx-auto">
      <h1 class="pt-4 pb-2 text-black">Upload your video here</h1>
      <div
        x-ref="dnd"
        class="
          relative
          flex flex-col
          text-gray-400
          bg-gray-50
          border border-gray-400 border-dashed
          cursor-pointer
        "
      >
        <input
          accept="video/*"
          type="file"
          multiple
          class="
            absolute
            inset-0
            z-50
            w-full
            h-full
            p-0
            m-0
            outline-none
            opacity-0
            cursor-pointer
          "
          @change="getVideoFile($event)"
        />


        <div
          class="flex flex-row items-center justify-center py-10 text-center"
          v-if="video === undefined"
        >
          <img src="../../assets/arrow-down.svg" />
          <p class="m-0">Drag your file here or click to upload.</p>
        </div>
        <video :src="video" class="w-36" v-else></video>
      </div>
      <div class="flex flex-row-reverse">
        <div class="settings__save mt-4">
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
            v-if="video != undefined"
          >
            <router-link to="/stream/token-gate">Next</router-link>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { fileToBlob } from '../../utils.js';
import { getCloudFlareAccountId, requestCloudflareDirectUploadAuth } from '../../cloudflare.js';

export default {
  name: "Upload",
  data() {
    return {
      video: undefined,
    };
  },
  methods: {
    async getVideoFile(e) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      // console.log(formData);

      if (file.type.split("/")[0] != "video") {
        alert("You can only upload videos!");
        return;
      }

      this.video = formData;;

      this.$emit("onVideoUploaded", this.video);
      
      // test
      const email = "lightanson@protonmail.com";
      const globalAPI = '9e71cdc773da780e5059efe41ee0887d86b08';

      // get account id
      const accountId = await getCloudFlareAccountId(email,globalAPI);

      console.log("AccountId:", accountId);
      
      const oneTimeUploadUrl = await requestCloudflareDirectUploadAuth(email, globalAPI, accountId);

      console.log(oneTimeUploadUrl);

      const uploadResult = await fetch(oneTimeUploadUrl, {
        method: "POST",
        body: formData,
      });
      console.log(uploadResult);      

    },
  },
};
</script>

<style lang="scss" scoped>
</style>