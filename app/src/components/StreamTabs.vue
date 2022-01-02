<template>
  <div class="flex justify-center items-center mb-6">
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button @click="onVideosClicked" :class="classSelector(0)" class="flex items-center h-10 px-2 py-2 -mb-px text-center bg-transparent border-b-2 sm:px-4 -px-1 whitespace-nowrap focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>

          <span class="mx-1 text-sm sm:text-base"> Videos </span>
        </button>

        <button @click="onLiveInputsClicked" :class="classSelector(1)" class="flex items-center h-10 px-2 py-2 -mb-px text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:px-4 -px-1 dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>

          <span  class="mx-1 text-sm sm:text-base"> Live Inputs </span>
        </button>

      </div>
    </div>
</template>

<script>
export default{
    name: "StreamTabs",
    data(){
        return {
            tab: 0,
        };
    },
    methods:{

        // 
        // When the "Videos" button is clicked
        // @returns { void } 
        //
        onVideosClicked(){
            this.tab = 0;
            this.$emit('onBtnVideosClicked');
        },

        // 
        // When the "Live Inputs" button is clicked
        // @returns { void } 
        //
        onLiveInputsClicked(){
            this.tab = 1;
            this.$emit('onBtnLiveInputsClicked');
        },

        //
        // Class selector
        //
        classSelector(_tab){
            return {
                'text-indigo-600': this.tab == _tab,
                'border-indigo-500': this.tab == _tab,
                'dark:border-indigo-400': this.tab == _tab,
                'dark:text-indigo-300': this.tab == _tab,
                'text-gray-700': this.tab != _tab,
                'border-gray-500': this.tab != _tab,
                'dark:border-gray-400': this.tab != _tab,
                'dark:text-gray-300': this.tab != _tab,
            };
        }


    }
};
</script>