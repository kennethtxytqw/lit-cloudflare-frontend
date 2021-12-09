<template>
  <div class="mt-20">
    <div class="w-2/3 m-auto h-10 flex">
      <router-link
        to="/upload/auth"
        class="
          bg-green-100
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
        "
      >
        <p>Log in</p>
      </router-link>
      <router-link
        to="/upload/upload"
        class="
          bg-green-100
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
        "
      >
        <p>Upload video</p>
      </router-link>
      <router-link
        to="/upload/token-gate"
        class="
          bg-green-100
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
          token-gate
        "
      >
        <p>Token-gate the video</p>
      </router-link>

      <router-link
        to="/upload/submit"
        class="
          bg-green-100
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
          submit
        "
      >
        <p>Overview & Submit</p>
      </router-link>
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

<style scoped>
.router-link-active {
  font-weight: 600;
  background-color: rgb(16, 185, 125);
}
</style>