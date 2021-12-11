<template>
  <div class="bg-gray-800 h-screen">
    <nav class="flex w-11/12 m-auto justify-between items-center text-white">
      <img alt="Vue logo" class="w-16 mt-4" src="./assets/logo.png" />
      <div class="flex">
        <p class="font-light"><router-link to="/">Watch</router-link></p>
        <p class="ml-8 font-light">
          <router-link to="/upload/auth">Upload</router-link>
        </p>
      </div>
      <div>
        <p @click="authMetamask">Login with Metamask</p>
        <div id="shareModal"></div>
      </div>
    </nav>
    <div class="mt-12">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      authSig: Object,
    };
  },
  methods: {
    async authMetamask() {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "ethereum",
      });
      this.authSig = authSig;
    },
    async fetchVideos() {
      console.log("TODO");
    },
  },
  async mounted() {
    var litNodeClient = new LitJsSdk.LitNodeClient();
    litNodeClient.connect();
    window.litNodeClient = litNodeClient;

    document.addEventListener(
      "lit-ready",
      function () {
        console.log("LIT network is ready");
        window.networkIsReady = true;
        this.authMetamask();
      }.bind(this),
      false
    );
  },
};
</script>

<style>
.router-link-active {
  font-weight: 600;
}
</style>