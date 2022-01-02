<template>
  <div
    class="bg-gray-50 w-2/3 rounded-b-3xl text-white font-semibold m-auto pt-10"
  >

  <!-- tabs -->
  <StreamTabs
    @onBtnVideosClicked="_onBtnVideosClicked"
    @onBtnLiveInputsClicked="_onBtnLiveInputsClicked"
  />

    <div class="bg-gray-50 p7 w-9/12 mx-auto">

      <!-- Tabs:: Videos -->
      <div v-if="streamType == 'Videos'"
        x-ref="dnd"
        class="relative flex flex-col text-gray-400 bg-gray-50 border border-gray-400 border-dashed border cursor-pointer
        "
      >
        <input
          accept="video/*"
          type="file"
          multiple
          class="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer
          "
          @change="getVideoFile($event)"
        />

        <div
          class="flex flex-col items-center justify-center py-10 text-center"
          v-if="previewFileBlob === null"
        >
        <div>
          <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="3em" width="3em" viewBox="0 0 40 40" style="vertical-align: middle;"><g><path d="m20 24.1l10-7.5-10-7.5v15z m13.4-20.7c1.8 0 3.2 1.4 3.2 3.2v20c0 1.8-1.4 3.4-3.2 3.4h-20c-1.8 0-3.4-1.6-3.4-3.4v-20c0-1.8 1.6-3.2 3.4-3.2h20z m-26.8 6.6v23.4h23.4v3.2h-23.4c-1.8 0-3.2-1.4-3.2-3.2v-23.4h3.2z"></path></g></svg>
        </div>
        
          <p class="m-0 text-2xl mt-4">Select a video to upload.</p>
          <p class="m-0 text-l">or drag and drop your video here.</p>
        </div>
        <div class="flex justify-center items-center min-h-24 p-2" v-else>
          <video :src="previewFileBlob" class="w-36 video"></video>
        </div>
      </div><!-- ...Videos -->

      <!-- Tab:: Live Inputs -->
      <div v-else>
        <div class="text-black text-center">

        <div v-if="streamData != null" class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 mb-4" role="alert">
          <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
          <p>You can now use the Url and Stream Key to push RTMPS streams to Cloudflare Stream.</p>
        </div>


          <table class="table-auto m-auto w-full">

            <tbody>

              <!-- row -->
              <tr v-if="streamData == null" class="bg-gray-100">
                <td class="border px-4 py-2">Stream Name</td>
                <td class="border px-4 py-2">
                  <input v-model="streamName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Stream Name">
                </td>
              </tr>
              <!-- row -->
              <tr v-if="streamData == null" class="bg-gray-100">
                <td class="border px-4 py-2"></td>
                <td class="border px-4 py-2 text-right">
                  <button @click="onBtnRequestUrlStreamKeyClicked" class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                          <span v-if="loading">Loading...</span>
                          <span v-else>Request URL & StreamKey</span>
                  </button>
                </td>
              </tr>
              
              <!-- row -->
              <tr v-if="streamData != null" class="bg-gray-100">
                <td class="border px-4 py-2">RTMP Url</td>
                <td class="border px-4 py-2 text-right">
                  <input :value="streamData['url']" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="12345678901234567890">
                </td>
              </tr>

              <!-- row -->
              <tr v-if="streamData != null" class="bg-gray-100">
                <td class="border px-4 py-2">RTMP Stream Key</td>
                <td class="border px-4 py-2 text-right">
                  <input :value="streamData['streamKey']" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="12345678901234567890">
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div><!-- ...Live Inputs -->

      <div class="flex flex-row-reverse pb-10">
        <div class="settings__save mt-4">
          <button
            class="bg-lit-primary text-white active:bg-purple-600 font-bold uppercase text-sm px-6 py-3 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150
            "
            v-if="(streamType == 'Videos' && previewFileBlob != null) || (streamType == 'Live Inputs' && streamData != null && loading == false)"
          >
            <router-link @click="onBtnNext()" to="/stream/token-gate">Next</router-link>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { fileToBlob } from "../../utils/utils.js";
import { requestUrlStreamKey } from "../../utils/cloudflare.js"
import StreamTabs from "../../components/StreamTabs.vue";

export default {
  name: "Upload",
  components:{
    StreamTabs
  },
  data() {
    return {
      // video: undefined,
      videoData: null,
      previewFileBlob: null,
      streamType: 'Videos', // Live Inputs or Videos
      streamName: '',
      streamData: null,
      loading: null,
    };
  },
  methods: {
    //
    // Get the video file from the file input field,
    // We will get the blob format for the video for preview,
    // and get the FormData type for that we can use it
    // to upload. Finally, we will emit the variables to the
    // parent component
    // @param { Object } e : event
    // @returns { void }
    //
    async getVideoFile(e) {
      const file = e.target.files[0];
      this.previewFileBlob = await fileToBlob(file);

      this.videoData = new FormData();
      this.videoData.append("file", file);

      if (file.type.split("/")[0] != "video") {
        alert("You can only upload videos!");
        return;
      }

    },

    onBtnNext(){
      console.log("Next");
      this.$emit("onVideoUploaded", {
        previewFileBlob: this.previewFileBlob, 
        videoData: this.videoData,
        streamData: this.streamData,
        streamType: this.streamType
      });
    },

    // 
    // (Child Event)
    // When the "Videos" button is clicked
    //
    _onBtnVideosClicked(){ 
      this.streamType = 'Videos';
    },

    // 
    // (Child Event)
    // When the "Live Inputs" button is clicked
    //
    _onBtnLiveInputsClicked(){
      this.streamType = 'Live Inputs';
    },

    //
    // When request URL & Stream key button is clicked
    // @returns { void }
    //
    async onBtnRequestUrlStreamKeyClicked(){

      if(!this.validateStreamName(this.streamName)){
        return;
      }
      this.loading = true;
      this.streamData = await requestUrlStreamKey(this.streamName);
      this.loading = false;

      console.log("streamData: ", this.streamData);
    },
    
    // 
    // Simple Input Validator
    // @returns { Boolean } true/false
    //
    validateStreamName(val){

      // Check if it's empty
      if(val == '' && val.length <= 0){
        alert('Stream name cannot be empty');
        return false;
      }

      return true;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>