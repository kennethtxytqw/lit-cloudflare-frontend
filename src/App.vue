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
        <button @click="openShareModal">Open Share Modal</button><br>
        <button @click="testFetch">Test fetch</button>

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
    loadJs(path){
      var tag = document.createElement('script')
      tag.setAttribute('src', path)
      document.head.appendChild(tag)
    },
    loadCss(path){
      var tag = document.createElement('link')
      tag.setAttribute('rel', 'stylesheet')
      tag.setAttribute('href', path)
      document.head.appendChild(tag)
    },
    async testFetch(){
      const res = await fetch('http://127.0.0.1:8787/wallet/test');
      const data = await res.json();
      console.log(data);
    },
    closeModal() {
      console.log("close share modal");
      ACCM.ReactContentRenderer.unmount(document.getElementById("shareModal"));
    },
    openShareModal() {
      console.log("open share modal");
      ACCM.ReactContentRenderer.render(
        ACCM.ShareModal,
        // props to be passed to the ShareModal component.  These are documented here: https://github.com/LIT-Protocol/lit-access-control-conditions-modal#props
        {
          sharingItems: [],
          onAccessControlConditionsSelected: function (accessControlConditions) {
            console.log(
              "accessControlConditions from ShareModal: ",
              accessControlConditions
            );
            this.closeModal();
            // now, use the accessControlConditions to provision access using one of the methods below:
            // https://github.com/LIT-Protocol/lit-js-sdk#dynamic-content---provisoning-access-to-a-resource
            // or https://github.com/LIT-Protocol/lit-js-sdk#static-content---storing-any-static-content-and-manually-storing-the-metadata
          },
          onClose: this.closeModal,
          getSharingLink: function (sharingItem) {
            console.log("getSharingLink", sharingItem);
            return "";
          },
          showStep: "ableToAccess",
        },
        // target DOM node
        document.getElementById("shareModal")
      );
    }
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

    this.loadJs('https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/index.js');
    this.loadCss('https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/main.css');
  },
};
</script>

<style>
.router-link-active {
  font-weight: 600;
}
</style>