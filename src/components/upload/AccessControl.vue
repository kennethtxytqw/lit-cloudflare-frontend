<template>
  <div
    class="
      bg-gray-50
      w-2/3
      h-60
      rounded-b-3xl
      text-black
      font-semibold
      m-auto
      flex flex-col
      justify-center
      items-center
    "
  >
    <p @click="openModal">Open Control Access Modal</p>

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
      v-if="acc"
    >
      <router-link to="/stream/submit">Next</router-link>
    </button>
  </div>
</template>

<script>
export default {
  name: "AccessControl",
  props: ["video"],
  data() {
    return {
      acc: false,
    };
  },
  methods: {
    openModal() {
      this.$emit("openShareModal");
    },
  },
  mounted() {
    if (this.video === "") {
      alert("Please upload a video.");
      this.$router.push({ path: "upload" });
    } else {
      this.$emit("openShareModal");
      this.acc = true;
    }
  },
};
</script>

