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
      h-72
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
  props: ["uploadedData"],
  data() {
    return {
      acc: false,
    };
  },
  methods: {

    // 
    // Emit event name onOpenShareModal to open the access control conditions modal
    //
    openModal() {
      this.$emit("onOpenShareModal");
    },
  },
  mounted() {
    console.log("---AccessControl---")
    
    if(this.uploadedData == null){
      this.deny("Please select a stream");
      return;
    }

    if(this.uploadedData['streamType'] == 'Videos'){
      this.handleVideosType(this.uploadedData);
      return;
    }

    if(this.uploadedData['streamType'] == 'Live Inputs'){
      this.handleLiveInputsType(this.uploadedData);
      return;
    }

  },

  methods:{
    //
    // Hadnle if stream type is 'Videos'
    // @retuns { void } 
    //
    handleVideosType(data){
      if(data['videoData'] == null || data['previewFileBlob'] == null){
        this.deny("Please upload a video");
        return;
      }
      this.grantNext();
    },

    // 
    // Handle if stream type is 'Live Inputs'
    // @retuns { void } 
    //
    handleLiveInputsType(data){
      if(data['streamData'] == null){
        this.deny("Please create a live inputs");
        return;
      }
      this.grantNext();
    },

    //
    // Deny current step, go back to previous
    // @param { String } message
    // @returns { void } 
    //
    deny(message){
      alert(message);
      this.$router.push({ path: "upload" })
    },

    //
    // Grant access to next step
    // @returns { void } 
    //
    grantNext(){
      this.$emit("onOpenShareModal");
      this.acc = true;
    }


  }

};
</script>

