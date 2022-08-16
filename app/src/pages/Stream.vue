<template>
  <div class="mt-20">
    <div class="w-2/3 m-auto h-10 flex text-white">
      <!-- tab -->
      <router-link
        to="/stream/upload"
        class="bg-lit-secondary flex-1 flex items-center justify-center cursor-pointer"
      >
        <p>Stream</p>
      </router-link>

      <!-- tab -->
      <router-link
        to="/stream/token-gate"
        class="bg-lit-secondary flex-1 flex items-center justify-center cursor-pointer token-gate"
      >
        <p>Token-gate the video</p>
      </router-link>

      <!-- tab -->
      <router-link
        to="/stream/submit"
        class="bg-lit-secondary flex-1 flex items-center justify-center cursor-pointer submit"
      >
        <p>Overview & Submit</p>
      </router-link>
    </div>

    <!-- content area -->
    <router-view
      @onVideoUploaded="onVideoUploaded"
      @onOpenShareModal="openShareModal"
      :acc="solRpcConditions"
      :uploadedData="uploadedData"
    ></router-view>
  </div>
</template>

<script>
import { injectCSS, injectJS } from "../utils/html.js";

export default {
  name: "Upload",
  data() {
    return {
      solRpcConditions: "",

      // coming from Upload.vue
      uploadedData: null,
      streamData: null,
      streamType: null,
    };
  },
  methods: {
    //
    // save video to the local state
    // @param { Object } an event emitted from the child component
    // @returns { void }
    //
    onVideoUploaded(e) {
      console.warn("onVideoUploaded:", e);
      this.uploadedData = e;
    },

    //
    // Cloud the access control conditions modal
    // @returns { void }
    //
    closeModal() {
      console.log("close share modal");
      ACCM.ReactContentRenderer.unmount(document.getElementById("shareModal"));
      if (this.solRpcConditions) this.$router.push({ path: "submit" });
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
          onsolRpcConditionsSelected: async (solRpcConditions) => {
            console.log("solRpcConditions from ShareModal: ", solRpcConditions);

            const temp = await solRpcConditions;
            this.solRpcConditions = temp.map((t) => ({
              ...t,
              chain: solana,
            }));
            console.log({
              solRpcConditions: this.solRpcConditions,
            });
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
    injectJS(ENV.LIT_ACCESS_CONTROL_MODAL_JS);
    injectCSS(ENV.LIT_ACCESS_CONTROL_MODAL_CSS);
  },
};
</script>

<style scoped>
.router-link-active {
  font-weight: 600;
  background-color: #5f35b8;
}
</style>
