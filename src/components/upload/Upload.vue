<template>
  <div
    class="bg-gray-50 w-2/3 h-60 rounded-b-3xl text-white font-semibold m-auto"
  >
    <div class="bg-gray-50 p7 rounded w-9/12 mx-auto">
      <h1 class="pt-4 pb-2 text-black">Upload your video here</h1>
      <div
        x-ref="dnd"
        class="
          relative
          flex flex-col
          text-gray-400
          bg-gray-50
          border border-gray-400 border-dashed
          rounded
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
        >
          <img src="../../assets/arrow-down.svg" />
          <p class="m-0">Drag your files here or click in this area.</p>
        </div>
      </div>
      <div class="flex flex-row-reverse">
        <button class="text-black" v-if="video != undefined">
          <router-link to="/upload/token-gate"
            ><p class="font-semibold">Next</p></router-link
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Upload",
  data() {
    return {
      video: undefined,
      uploadPercentage: 0,
    };
  },
  methods: {
    getVideoFile(e) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (reader.result.substr(5, 5) != "video") {
          alert("You can only upload videos!");
        } else {
          this.video = reader.result;
        }
      });
      reader.readAsDataURL(e.target.files[0]);
      // TODO: Add Progress bar
      //   axios.post("", this.video, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //     onUploadProgress: function (progressEvent) {
      //       this.uploadPercentage = parseInt(
      //         Math.round((progressEvent.loaded / progressEvent.total) * 100)
      //       );
      //     }.bind(this),
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>