<template>
  <div class="">
    <h1 class="text-white font-bold text-6xl mt-24 text-center">Lit-Browser Extension</h1>
    <p class="text-gray-400 text-center pt-8 text-3xl w-3/4 m-auto">
      Token-gate your video right in the CloudFlare dashboard, then copy & paste the snippets to your website, or anywhere you feel like!
    </p>
  </div>

  <!-- video -->
  <div class="w-11/12 m-auto box-border mt-16">
    <div class="text-white text-center m-auto flex justify-center">
      <video controls autoplay width="w-full m-auto">
          <source src="https://assets.wzac.io/lit-protocol/Lit-CloudFlare-Browser-Extension-Demo.mp4"
                  type="video/mp4">

          Sorry, your browser doesn't support embedded videos.
      </video>
    </div><!-- ...video -->

    <div class="flex">
      <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full my-12 m-auto text-2xl ">
        <a href="https://github.com/wzac-io/lit-cloudflare-browser-extension" target="__blank">Download & Explore Documentation</a>
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: "Plugin",
  data() {
    return {
      downloadLink: '',
    };
  },
  methods: {

  },

  async mounted() {

  },
  async created() {

  },
};
</script>

<style >


</style>