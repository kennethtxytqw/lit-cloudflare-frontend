<template>
  <div class="bg-gray-800 h-screen">
    <nav class="flex w-11/12 m-auto justify-between items-center text-white">
      <img alt="Vue logo" class="w-16 mt-4" src="./assets/logo.png" />
      <div class="flex">
        <p class="font-light">Watch</p>
        <p class="ml-8 font-semibold">Upload</p>
      </div>
    </nav>

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
          <router-link to="/upload">
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
          <router-link to="/token-gate">
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
          <router-link to="/submit">
            <p>Overview & Submit</p>
          </router-link>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  watch: {
    $route(to, from) {
      if (this.$route.name === "Upload") {
        const token_gate_element = document.querySelector(".token-gate");
        const submit_element = document.querySelector(".submit");
        submit_element.classList.remove("bg-green-500");
        token_gate_element.classList.remove("bg-green-500");
        submit_element.classList.add("bg-gray-500");
        token_gate_element.classList.add("bg-gray-500");
      } else if (this.$route.name === "Token Gate") {
        const token_gate_element = document.querySelector(".token-gate");
        token_gate_element.classList.remove("bg-gray-300");
        token_gate_element.classList.add("bg-green-500");
        const submit_element = document.querySelector(".submit");
        submit_element.classList.remove("bg-green-500");
        submit_element.classList.add("bg-gray-300");
      } else if (this.$route.name === "Submit") {
        const submit_element = document.querySelector(".submit");
        submit_element.classList.remove("bg-gray-300");
        submit_element.classList.add("bg-green-500");
        const token_gate_element = document.querySelector(".token-gate");
        token_gate_element.classList.remove("bg-gray-300");
        token_gate_element.classList.add("bg-green-500");
      }
    },
  },
};
</script>