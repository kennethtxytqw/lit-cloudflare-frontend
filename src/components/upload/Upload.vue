<template>
  <div
    class="bg-gray-50 w-2/3 h-60 rounded-b-3xl text-white font-semibold m-auto"
  >
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
          <p class="m-0">Drag your files here or click in this area.</p>
        </div>
        <video :src="video" class="w-36" v-else></video>
      </div>
      <div class="flex flex-row-reverse">
        <div class="settings__save mt-4">
          <button
            @click="login"
            class="
              bg-green-500
              text-white
              active:bg-purple-600
              font-bold
              uppercase
              text-sm
              px-6
              py-3
              rounded-3xl
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
            <router-link to="/upload/token-gate">Next</router-link>
          </button>
        </div>
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
          this.$emit("videoUploaded", reader.result);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>