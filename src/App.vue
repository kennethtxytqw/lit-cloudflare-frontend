<template>
  <div class="h-screen m-auto" style="max-width: 92.8%; padding-top: 10px">
    <div id="github" class="fixed bottom-0 right-0 z-10 w-12 h-12">
      <a href="https://github.com/wzac-io" target="_blank">
        <img src="./assets/github.svg" alt="Github" />
      </a>
    </div>
    <nav class="flex w-11/12 m-auto items-center text-white">
      <router-link to="/" class="flex-1">
        <!-- logo -->
        <div class="logo" style="justify-content: start">
          <img alt="Lit-CloudFlare" class="w-16 mt-4" src="./assets/logo.png" />
          <span>Lit-CloudFlare</span>
        </div>
      </router-link>
      <div class="flex flex-2">
        <p
          class="btn-nav font-light"
          style="font-size: 20px; padding-top: 12px"
        >
          <router-link to="/">Watch</router-link>
        </p>
        <p
          class="btn-nav ml-8 font-light"
          style="font-size: 20px; padding-top: 12px"
        >
          <router-link to="/stream/auth">Upload</router-link>
        </p>
        <p
          class="btn-nav ml-8 font-light"
          style="font-size: 20px; padding-top: 12px"
        >
          <router-link to="/plugin">Plugin</router-link>
        </p>
      </div>
      <div id="shareModal"></div>
      <div v-if="!walletAddress" class="flex flex-1 justify-end cursor-pointer">
        <p @click="authMetamask">Login with Metamask</p>
      </div>
      <div v-else class="flex flex-1 justify-end items-center">
        <p class="font-semibold text-lg text-white">
          {{ walletAddress.substring(0, 6) }}...{{
            walletAddress.substring(
              walletAddress.length - 4,
              walletAddress.length
            )
          }}
        </p>
        <Blockie class="ml-6" :address="walletAddress" />
      </div>
    </nav>
    <div class="mt-12">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Blockie from "./components/Blockie.vue";

export default {
  name: "App",
  components: {
    Blockie,
  },
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
.btn-nav .router-link-active {
  border-bottom: 1px solid #f23c2c;
  padding-bottom: 3px;
}
body {
  background: #160736;
  background: -webkit-linear-gradient(top left, #160736, #010008);
  background: -moz-linear-gradient(top left, #160736, #010008);
  background: linear-gradient(to bottom right, #160736, #010008);
}
.logo {
  display: flex;
}
.logo img {
  width: 50px;
  height: 50px;
}
.logo span {
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