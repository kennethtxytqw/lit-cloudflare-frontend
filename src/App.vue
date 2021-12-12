<template>
  <div class="h-screen">
    <nav class="flex w-11/12 m-auto items-center text-white">
      <router-link to="/" class="flex-1">
        <!-- logo -->
        <div class="logo">
          <img alt="Lit-CloudFlare" class="w-16 mt-4" src="./assets/logo.png" />
          <span>Lit-CloudFlare</span>
        </div>
      </router-link>
      <div class="flex flex-2">
        <p class="font-light"><router-link to="/">Watch</router-link></p>
        <p class="ml-8 font-light">
          <router-link to="/stream/auth">Upload</router-link>
        </p>
      </div>
      <div id="shareModal"></div>
      <div v-if="!walletAddress" class="flex flex-1 justify-end">
        <p @click="authMetamask">Login with Metamask</p>
      </div>
      <div v-else class="flex flex-1 justify-end">
        <p class="font-semibold text-lit-secondary">
          {{ walletAddress.substring(0, 6) }}...{{
            walletAddress.substring(
              walletAddress.length - 4,
              walletAddress.length
            )
          }}
        </p>
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
      walletAddress: "",
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
    this.authMetamask();
  },
  watch: {
    async authSig(newValue, oldValue) {
      if (oldValue !== newValue) {
        this.walletAddress = await newValue.address;
      }
    },
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
.logo{
  display: flex;
  justify-content: start;
}
.logo span{
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 18px;
  padding-left: 8px;
  font-size: 28px;
  box-sizing: border-box;
  text-shadow: 1px 0px 2px #9d3226;
  font-weight: 500;
}
</style>