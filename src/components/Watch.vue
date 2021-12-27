<template>
  <div class="flex w-11/12 m-auto">
    <p class="text-white font-semibold text-2xl">Videos from the creator</p>
  </div>
  <div class="w-11/12 m-auto box-border mt-16">
    <!-- all videos will be injected here -->
    <div id="lit-videos" v-html="HTMLcontent"></div>
    <div class="text-white text-center" v-if="HTMLcontent == ''">
      ...Oops!<br>
      It's doesn't seem like you have upload any videos, click <a href="./stream/auth">upload</a> to begin!
    </div>
  </div>
</template>

<script>
import {
  getCloudFlareVideos,
  getCloudFlareValueFromKey,
} from "../cloudflare.js";

import {
  injectCSS,
  injectJS,
} from "../utils/html.js";

//
// Get readable access control from LitSDK
// @param { String } accessControlConditions in string
// @returns { String } Humanised access control
//
const accessControlToReadable = async (value) => {
  return await LitJsSdk.humanizeAccessControlConditions({
    accessControlConditions: value,
  });
};

export default {
  name: "Watch",
  data() {
    return {
      HTMLcontent: "",
      jsLoaded: false,
      col: 4,
    };
  },
  methods: {

    // 
    // Create a copy/pastable snippet 
    // @param { String } readable 
    // @param { String } data
    // @returns { String } snippet
    //
    getSnippet(readable, data) {
      return `<div class="lit-video-wrapper">
    <iframe 
        src=""
        class="lit-video"
        allow="accelerometer; gyroscope; 
        autoplay; encrypted-media; 
        picture-in-picture;" 
        allowfullscreen="true"
        data-readable-conditions="${readable}"
        data-lit="${data}">
    </iframe>
    <button class="btn-lit-video-unlock">🔥  Unlock with Lit-Protocol</button>
</div>
`;
    },
  },

  async mounted() {
    injectCSS(ENV.LIT_UNLOCK_CSS);
  },

  // 
  // Get a list of videos, for each video we will use its key and data
  // to fetch the data from CloudFlare. The returned data consists of
  // encrypted data and access control conditions in readable format which 
  // are then used to generate the snippet. 
  // 
  async created() {
    console.log("--- created ---");
    const videos = await getCloudFlareVideos();
    console.log("Videos:", videos);

    for (const i in videos) {
      const item = videos[i];
      const key = item.name;
      const data = key.split(":");
      // const walletAddress = data[0];
      // const accountId = data[1];
      // const namespaceId = data[2];
      // const randomId = data[3];

      const result = await getCloudFlareValueFromKey(key);

      const videoData = JSON.parse(atob(result.data));

      const readableAccessControlConditions = (
        await accessControlToReadable(
          JSON.parse(atob(videoData.accessControlConditions))
        )
      ).join();

      console.log(readableAccessControlConditions);

      const snippet = this.getSnippet(
        readableAccessControlConditions,
        result.data
      );

      this.HTMLcontent += snippet;

      // Add the script at the end of the loop
      if (i == videos.length - 1) {
        injectJS(ENV.LIT_UNLOCK_JS);
      }
    }
  },
};
</script>

<style >
.lit-video-description {
  top: calc(90% - (9% / 16 * 100)) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.lit-video-info {
  display: flex;
  @apply break-all;
}
#lit-videos {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
}

@media all and (min-width: 1155px) and (max-width: 1522px) { 
  #lit-videos {
    grid-template-columns: 1fr 1fr 1fr;
  }

}
@media all and (min-width: 800px) and (max-width: 1154px) { 
  #lit-videos {
    grid-template-columns: 1fr 1fr;
  }

}

.lit-video-wrapper {
  min-width: 343px;
  width: 100%;
  transition: all linear 1s;
  margin-bottom: 24px
}

</style>