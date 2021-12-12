<template>
  <div class="flex w-11/12 m-auto">
    <p class="text-white font-semibold text-2xl">Videos from the creator</p>
  </div>
  <div class="w-full m-auto px-16 box-border mt-16">
  <!-- all videos will be injected here -->
  <div id="lit-videos" v-html="HTMLcontent"></div>
  </div>
</template>

<script>
import { getCloudFlareVideos, getCloudFlareValueFromKey } from '../cloudflare.js';

const accessControlToReadable = async (value) => {
  return await LitJsSdk.humanizeAccessControlConditions({
    accessControlConditions: value,
  });
};

export default {
  name: "Watch",
  data(){
    return {
      HTMLcontent: '',
      jsLoaded: false,
    }
  },
  methods:{
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
    getSnippet(readable, data){
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

  async mounted(){
    this.loadCss('https://cloudflare-lit-protocol-integration.vercel.app/lit-unlock.min.css');
    
  },
  async created(){

    console.log("--- created ---");
    const videos = await getCloudFlareVideos();
    console.log("Videos:", videos);

    for (const i in videos){
      
      const item = videos[i];
      const key = item.name;
      const data = key.split(':')
      const walletAddress = data[0];
      // const accountId = data[1];
      // const namespaceId = data[2];
      // const randomId = data[3];

      const result = await getCloudFlareValueFromKey(key);

      const videoData = JSON.parse(atob(result.data));

      const readableAccessControlConditions = (await accessControlToReadable(JSON.parse(atob(videoData.accessControlConditions)))).join();

      console.log(readableAccessControlConditions);

      const snippet = this.getSnippet(readableAccessControlConditions, result.data);

      this.HTMLcontent += snippet;
      
      // Add the script at the end of the loop
      if(i == videos.length - 1){
        this.loadJs('https://cloudflare-lit-protocol-integration.vercel.app/lit-unlock.min.js');
      }
    }
  }

};
</script>

<style >
.lit-video-description{
  top: calc(84% - (9% / 16 * 100)) !important;
}
.lit-video-info{
  display: flex;
}
#lit-videos{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 12px;
}
</style>