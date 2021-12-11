<template>
  <div
    class="
      bg-gray-50
      w-2/3
      rounded-b-3xl
      text-black
      font-semibold
      m-auto
      flex flex-col
      justify-center
      items-center
    "
  >
    <div class="flex flex-col w-4/5 my-8">
      <label>Account Details</label>
      <div>
        <p class="font-light">E-Mail</p>
        <p class="font-medium">{{ email }}</p>
      </div>

      <div class="mt-4">
        <p class="font-light">Global API</p>
        <p class="font-medium">
          {{ global_api.toString().substr(0, 4) }}...{{
            global_api.toString().substr(33, 4)
          }}
        </p>
      </div>

      <label class="mt-6">Video and access details</label>

      <div>
        <p class="font-light">Access control conditions</p>
        <p class="font-medium">{{ acc }}</p>
      </div>

      <div class="mt-4">
        <p class="font-light">Video preview</p>
        <video class="w-48" :src="video"></video>
      </div>
    </div>
    <button
      class="
        bg-lit-primary
        text-white
        active:bg-purple-600
        font-bold
        uppercase
        text-sm
        px-6
        py-3
        rounded-xl
        shadow
        hover:shadow-lg
        outline-none
        focus:outline-none
        mr-1
        mb-1
        ease-linear
        transition-all
        duration-150
      "
    >
      Submit
    </button>
  </div>
</template>

<script>
export default {
  name: "AccessControl",
  props: ["acc", "video", "email", "global_api"],
  // TODO: Add human readable access control
  // methods: {
  //   async human() {
  //     const accessControlConditions = JSON.parse(
  //       JSON.stringify(await this.acc)
  //     )[0];
  //     console.log(accessControlConditions);
  //     console.log(
  //       await LitJsSdk.humanizeAccessControlConditions({
  //         accessControlConditions,
  //         myWalletAddress: "0x32934dA17622faEb1F8c9fAb354fc194cF8e4378",
  //       })
  //     );
  //   },
  // },
  // async mounted() {
  //   this.human();
  // },
};
</script>

