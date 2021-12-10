<template>
  <div class="h-screen">
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
body {
  background: #150636;
  background: -webkit-radial-gradient(center, #150636, #010008);
  background: -moz-radial-gradient(center, #150636, #010008);
  background: radial-gradient(ellipse at center, #150636, #010008);
}
</style>