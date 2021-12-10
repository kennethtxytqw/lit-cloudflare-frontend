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
    <button class="text-black" v-if="acc">
      <router-link to="/upload/submit">Next</router-link>
    </button>
  </div>
</template>

<script>
export default {
  name: "AccessControl",
  data() {
    return {
      acc: false,
    };
  },
  methods: {
    openModal() {
      this.$emit("openShareModal");
      this.acc = true;
    },
  },
};
</script>

