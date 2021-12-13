<template>
  <div class="h-screen m-auto" style="max-width: 92.8%; padding-top: 10px;">
    <nav class="flex w-11/12 m-auto items-center text-white">
      <router-link to="/" class="flex-1">
        <!-- logo -->
        <div class="logo">
          <img alt="Lit-CloudFlare" class="w-16 mt-4" src="./assets/logo.png" />
          <span>Lit-CloudFlare</span>
        </div>
      </router-link>
      <div class="flex flex-2">
        <p class="font-light" style="font-size:20px;padding-top:12px;"><router-link to="/">Watch</router-link></p>
        <p class="ml-8 font-light" style="font-size:20px;padding-top:12px;">
          <router-link to="/stream/auth" class="transition-all">Upload</router-link>
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
.logo img{
  width: 50px;
  height: 50px;
}
.logo span{
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 18px;
  padding-left: 18px;
  box-sizing: border-box;

  font-style: normal;
  font-weight: 400;
  font-size: 1.8rem;

}
</style>