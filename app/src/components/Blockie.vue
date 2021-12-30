<template>
  <div class="icon-div"></div>
</template>

<script>
import blockies from "ethereum-blockies";

export default {
  name: "Blockies",
  props: ["address"],
  data() {
    return {
      icon: null,
    };
  },

  methods: {
    createBlockie(addressSeed) {
      if (addressSeed) {
        var icon = blockies.create({
          seed: `#${addressSeed.substr(28, 8)}`,
          color: `#${addressSeed.substr(2, 2)}`,
          bgcolor: `#${addressSeed.substr(9, 6)}`,
          size: 15,
          scale: 3,
          spotcolor: `#${addressSeed.substr(22, 6)}`,
        });
        const children = document.querySelector(".icon-div").children.length;
        if (!children) {
          document
            .querySelector(".icon-div")
            .appendChild(icon)
            .classList.add("rounded-xl", "blockie");
        } else {
          document.querySelector(".blockie").remove();
          document
            .querySelector(".icon-div")
            .appendChild(icon)
            .classList.add("rounded-xl", "blockie");
        }
        this.icon = icon;
      }
    },
  },
  watch: {
    address(newValue, oldValue) {
      if (newValue != oldValue) this.createBlockie(this.address);
    },
  },
  mounted() {
    this.createBlockie(this.address);
  },
};
</script>
