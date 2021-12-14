<template>
  <div
    class="bg-gray-50 w-2/3 rounded-b-3xl text-white font-semibold m-auto pt-10"
  >
    <div class="bg-gray-50 p7 w-9/12 mx-auto">
      <div
        x-ref="dnd"
        class="
          relative
          flex flex-col
          text-gray-400
          bg-gray-50
          border border-gray-400 border-dashed
          border
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
          class="flex flex-col items-center justify-center py-10 text-center"
          v-if="video === undefined"
        >
        <div>
          <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="3em" width="3em" viewBox="0 0 40 40" style="vertical-align: middle;"><g><path d="m20 24.1l10-7.5-10-7.5v15z m13.4-20.7c1.8 0 3.2 1.4 3.2 3.2v20c0 1.8-1.4 3.4-3.2 3.4h-20c-1.8 0-3.4-1.6-3.4-3.4v-20c0-1.8 1.6-3.2 3.4-3.2h20z m-26.8 6.6v23.4h23.4v3.2h-23.4c-1.8 0-3.2-1.4-3.2-3.2v-23.4h3.2z"></path></g></svg>
        </div>
        
          <p class="m-0 text-2xl mt-4">Select a video to upload.</p>
          <p class="m-0 text-l">or drag and drop your video here.</p>
        </div>
        <div class="flex justify-center items-center h-24" v-else>
          <video :src="video" class="w-36 video"></video>
        </div>
      </div>
      <div class="flex flex-row-reverse pb-10">
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
import { fileToBlob } from "../../utils.js";

export default {
  name: "Upload",
  data() {
    return {
      video: undefined,
    };
  },
  methods: {
    //
    // Get the video file from the file input field,
    // We will get the blob format for the video for preview,
    // and get the FormData type for that we can use it
    // to upload. Finally, we will emit the variables to the
    // parent component
    // @params { Object } e : event
    // @returns { void }
    async getVideoFile(e) {
      const file = e.target.files[0];
      const previewFileBlob = await fileToBlob(file);

      const videoData = new FormData();
      videoData.append("file", file);

      if (file.type.split("/")[0] != "video") {
        alert("You can only upload videos!");
        return;
      }

      this.video = previewFileBlob;

      this.$emit("onVideoUploaded", { previewFileBlob, videoData });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>