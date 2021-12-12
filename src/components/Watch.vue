<template>
  <div class="flex w-11/12 m-auto">
    <p class="text-white font-semibold text-2xl">Videos from the creator</p>
  </div>
</template>

<script>
export default {
  async mounted() {
    const url =
      "https://api.cloudflare.com/client/v4/accounts/9b47beba2f167662ac16b81572ee529d/stream";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Email": "lightanson@protonmail.com",
        "X-Auth-Key": "9e71cdc773da780e5059efe41ee0887d86b08",
      },
    };

    const res = await fetch(url, options);
    const result = await res.json();
    console.log(result);
  },
};
</script>

<style lang="scss" scoped>
</style>