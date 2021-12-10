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
      <p class="text-lg">{{ email }}</p>
      <p class="text-lg">
        {{ global_api.toString().substr(0, 4) }}...{{
          global_api.toString().substr(33, 4)
        }}
      </p>

      <label class="mt-6">Video and access details</label>
      <p class="text-lg">{{ acc }}</p>
      <video class="w-48" :src="video"></video>
    </div>
    <button
      class="
        bg-green-500
        text-white
        active:bg-purple-600
        font-bold
        uppercase
        text-sm
        px-6
        py-3
        rounded-3xl
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
  mounted() {
    console.log(this.video);
  },
};
</script>

