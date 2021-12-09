<template>
  <div class="bg-gray-800 h-screen">
    <nav class="flex w-11/12 m-auto justify-between items-center text-white">
      <img alt="Vue logo" class="w-16 mt-4" src="./assets/logo.png" />
      <div class="flex">
        <p class="font-light"><router-link to="/">Watch</router-link></p>
        <p class="ml-8 font-light">
          <router-link to="/upload/upload">Upload</router-link>
        </p>
      </div>
      <div>
        <p @click="authMetamask">Login with Metamask</p>
      </div>
    </nav>
    <router-view></router-view>
    <h1>{{ authSig }}</h1>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      authSig: Object,
      client: undefined,
    };
  },
  methods: {
    async authMetamask() {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "ethereum",
      });
      this.authSig = authSig;
    },
  },
  async mounted() {
    var litNodeClient = new LitJsSdk.LitNodeClient();
    litNodeClient.connect();
    this.client = litNodeClient;
    console.log(litNodeClient);
    console.log(this.client);

    document.addEventListener(
      "lit-ready",
      function (e) {
        console.log("LIT network is ready");
      },
      false
    );
  },
  // watch: {
  //   $route(to, from) {
  //     if (this.$route.name === "Upload") {
  //       const token_gate_element = document.querySelector(".token-gate");
  //       const submit_element = document.querySelector(".submit");
  //       submit_element.classList.remove("bg-green-500");
  //       token_gate_element.classList.remove("bg-green-500");
  //       submit_element.classList.add("bg-gray-500");
  //       token_gate_element.classList.add("bg-gray-500");
  //     } else if (this.$route.name === "Token Gate") {
  //       const token_gate_element = document.querySelector(".token-gate");
  //       token_gate_element.classList.remove("bg-gray-300");
  //       token_gate_element.classList.add("bg-green-500");
  //       const submit_element = document.querySelector(".submit");
  //       submit_element.classList.remove("bg-green-500");
  //       submit_element.classList.add("bg-gray-300");
  //     } else if (this.$route.name === "Submit") {
  //       const submit_element = document.querySelector(".submit");
  //       submit_element.classList.remove("bg-gray-300");
  //       submit_element.classList.add("bg-green-500");
  //       const token_gate_element = document.querySelector(".token-gate");
  //       token_gate_element.classList.remove("bg-gray-300");
  //       token_gate_element.classList.add("bg-green-500");
  //     }
  //   },
  // },
};
</script>