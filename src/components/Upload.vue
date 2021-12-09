<template>
  <div class="mt-20">
    <div class="w-2/3 m-auto h-10 flex">
      <div
        class="
          bg-green-500
          flex-1 flex
          items-center
          justify-center
          font-semibold
          cursor-pointer
        "
      >
        <router-link to="/upload/upload">
          <p>Upload video</p>
        </router-link>
      </div>
      <div
        class="
          bg-gray-300
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
          token-gate
        "
      >
        <router-link to="/upload/token-gate">
          <p>Token-gate the video</p>
        </router-link>
      </div>
      <div
        class="
          bg-gray-300
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
          submit
        "
      >
        <router-link to="/upload/submit">
          <p>Overview & Submit</p>
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Upload",
};
</script>

<style lang="scss" scoped>
</style>