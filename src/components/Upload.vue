<template>
  <div class="mt-20">
    <div class="w-2/3 m-auto h-10 flex">
      <router-link
        to="/upload/auth"
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
        to="/upload/upload"
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
        to="/upload/token-gate"
        class="
          bg-lit-secondary
          flex-1 flex
          items-center
          justify-center
          cursor-pointer
          token-gate
        "
        @click="openShareModal"
      >
        <p>Token-gate the video</p>
      </router-link>

      <router-link
        to="/upload/submit"
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
      @videoUploaded="saveVideo"
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
    saveVideo(e) {
      this.video = e;
    },
    saveLoginInfo(e) {
      console.log(JSON.parse(atob(e)));
      this.email = JSON.parse(atob(e)).email;
      this.global_api = JSON.parse(atob(e)).global_api;
    },
    loadJs(path) {
      var tag = document.createElement("script");
      tag.setAttribute("src", path);
      document.head.appendChild(tag);
    },
    loadCss(path) {
      var tag = document.createElement("link");
      tag.setAttribute("rel", "stylesheet");
      tag.setAttribute("href", path);
      document.head.appendChild(tag);
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
    this.loadJs(
      "https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/index.js"
    );
    this.loadCss(
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