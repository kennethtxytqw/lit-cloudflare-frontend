<template>
  <div class="mt-20">
    <div class="w-2/3 m-auto h-10 flex text-white">
      <router-link
        to="/stream/auth"
        class="
          bg-lit-secondary
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
        "
      >
        <p>Log in</p>
      </router-link>
      <router-link
        to="/stream/upload"
        class="
          bg-lit-secondary
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
        "
      >
        <p>Upload video</p>
      </router-link>
      <router-link
        to="/stream/token-gate"
        class="
          bg-lit-secondary
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
        to="/stream/submit"
        class="
          bg-lit-secondary
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

    <router-view
      @onVideoUploaded="saveVideo"
      @openShareModal="openShareModal"
      @loginInfo="saveLoginInfo"
      :acc="accessControlConditions"
      :video="video"
      :email="email"
      :global_api="global_api"
    ></router-view>
  </div>
</template>

<script>
export default {
  name: "Upload",
  data() {
    return {
      accessControlConditions: "",
      video: "",
      email: "",
      global_api: "",
    };
  },
  methods: {

    //
    // save video to the local state
    // @param { Object } an event emitted from the child component
    // @returns { void }
    // 
    saveVideo(e) {
      console.warn("saveVideo:", e);
      this.video = e;
    },

    // 
    // Save the login info from base64 to the original state to local state
    // @param { Object } an event emitted from the child component
    // @param { void } 
    // 
    saveLoginInfo(e) {
      console.log(JSON.parse(atob(e)));
      this.email = JSON.parse(atob(e)).email;
      this.global_api = JSON.parse(atob(e)).global_api;
    },

    // 
    // Inject External Javascript
    // @param { String } path : eg. https://cdn.jquery.com/jquery.min.js
    // @returns { void }
    // 
    injectJS(path) {
      var tag = document.createElement("script");
      tag.setAttribute("src", path);
      document.head.appendChild(tag);
    },

    //
    // Inject external CSS stylesheet
    // @param { String } path : eg. http://cdn.jqeruy.com/style.css
    // @returns { void } 
    //
    injectCSS(path) {
      var tag = document.createElement("link");
      tag.setAttribute("rel", "stylesheet");
      tag.setAttribute("href", path);
      document.head.appendChild(tag);
    },

    // 
    // Cloud the access control conditions modal 
    // @returns { void } 
    //
    closeModal() {
      console.log("close share modal");
      ACCM.ReactContentRenderer.unmount(document.getElementById("shareModal"));
      if (this.accessControlConditions) this.$router.push({ path: "submit" });
    },

    // 
    // Open the access control models 
    // @returns { void } 
    //
    openShareModal() {
      console.log("open share modal");
      ACCM.ReactContentRenderer.render(
        ACCM.ShareModal,
        // props to be passed to the ShareModal component.  These are documented here: https://github.com/LIT-Protocol/lit-access-control-conditions-modal#props
        {
          sharingItems: [],
          onAccessControlConditionsSelected: async (
            accessControlConditions
          ) => {
            console.log(
              "accessControlConditions from ShareModal: ",
              accessControlConditions
            );

            this.accessControlConditions = await accessControlConditions;
            console.log(this.accessControlConditions);
            this.closeModal();
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
    },
  },
  async mounted() {
    this.injectJS(
      "https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/index.js"
    );
    this.injectCSS(
      "https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/main.css"
    );
  },
};
</script>

<style scoped>
.router-link-active {
  font-weight: 600;
  background-color: #5f35b8;
}
</style>