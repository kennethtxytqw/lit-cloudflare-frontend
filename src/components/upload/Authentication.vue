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
    <fieldset class="w-full flex flex-col items-center">
      <div class="settings__row w-2/5">
        <p>E-Mail</p>
        <input
          id="cf_username"
          type="text"
          v-model="email"
          class="
            px-2
            py-1
            placeholder-gray-400
            text-gray-600
            relative
            rounded
            text-sm
            border border-gray-400
            outline-none
            focus:outline-none focus:ring
            w-full
          "
        />
      </div>
      <div class="settings__row mt-4 w-2/5">
        <p>Global API</p>
        <input
          id="cf_global_api"
          type="text"
          v-model="global_api"
          class="
            px-2
            py-1
            placeholder-gray-400
            text-gray-600
            relative
            rounded
            text-sm
            border border-gray-400
            outline-none
            focus:outline-none focus:ring
            w-full
          "
        />
      </div>
      <!-- <div class="settings__row">
        <p>Account ID</p>
        <input
          id="cf_account_id"
          type="text"
          value="9b47beba2f167662ac16b81572ee529d"
        />
      </div> -->
      <div class="settings__save mt-4">
        <button
          @click="login"
          class="
            bg-green-500
            text-white
            active:bg-purple-600
            font-bold
            uppercase
            text-sm
            px-6
            py-3
            rounded-full
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
          Save to LIT Network
        </button>
      </div>
    </fieldset>
    <div>
      <p v-if="loggedIn"><router-link to="/upload/upload">Next</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Authentication",
  data() {
    return {
      loggedIn: false,
      email: "lightanson@protonmail.com",
      global_api: "9e71cdc773da780e5059efe41ee0887d86b08",
    };
  },
  methods: {
    //
    // turn blob data to data URI
    // @param { Blob } blob
    // @return { Promise<String> } blob data in data URI
    //
    async blobToDataURI(blob) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = (e) => {
          var data = e.target.result;
          resolve(data);
        };
        reader.readAsDataURL(blob);
      });
    },
    buf2hex(buffer) {
      // buffer is an ArrayBuffer
      return [...new Uint8Array(buffer)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
    },
    async login() {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "ethereum",
      });

      const loginDataObject = btoa(
        JSON.stringify({
          email: this.email,
          global_api: this.global_api,
        })
      );
      const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
        loginDataObject
      );

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "ethereum",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: "0x32934dA17622faEb1F8c9fAb354fc194cF8e4378", // Get users wallet
          },
        },
      ];
      const encryptedSymmetricKey =
        await window.litNodeClient.saveEncryptionKey({
          accessControlConditions,
          symmetricKey,
          authSig,
          chain: "ethereum",
        });
      localStorage.setItem("encryptedSymmKey", encryptedSymmetricKey);
      localStorage.setItem("encryptedZipBlob", encryptedZip);
      if (encryptedZip && encryptedSymmetricKey) this.loggedIn = true;
    },
  },
  async mounted() {
    setTimeout(() => {
      var litNodeClient = new LitJsSdk.LitNodeClient();
      litNodeClient.connect();
      window.litNodeClient = litNodeClient;
    }, 100);

    document.addEventListener(
      "lit-ready",
      async function () {
        console.log("LIT network is ready");
        // Login data decryption (reading from localstorage) not working
        // const authSig = await LitJsSdk.checkAndSignAuthMessage({
        //   chain: "ethereum",
        // });
        // const accessControlConditions = [
        //   {
        //     contractAddress: "",
        //     standardContractType: "",
        //     chain: "ethereum",
        //     method: "",
        //     parameters: [":userAddress"],
        //     returnValueTest: {
        //       comparator: "=",
        //       value: "0x32934dA17622faEb1F8c9fAb354fc194cF8e4378",
        //     },
        //   },
        // ];
        // const encryptedSymmetricKey = localStorage.getItem("encryptedSymmKey");
        // const encryptedZip = localStorage.getItem("encryptedZipBlob");
        // console.log(await this.blobToDataURI(await encryptedZip)); // TypeError: Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.
        // // Decrypt
        // const symmKey = window.litNodeClient.getEncryptionKey({
        //   accessControlConditions, // from a db
        //   toDecrypt: this.buf2hex(encryptedSymmetricKey.buffer), // from local storage
        //   chain: "ethereum",
        //   authSig,
        // });
        // const decryptedFiles = await LitJsSdk.decryptZip(
        //   encryptedZip,
        //   await symmKey
        // );
        // console.log(decryptedFiles);
        // const decryptedString = await decryptedFiles["string.txt"].async(
        //   "text"
        // );
        // console.log(JSON.parse(atob(decryptedString)));
      }.bind(this),
      false
    );
  },
};
</script>

<style lang="scss" scoped>
</style>