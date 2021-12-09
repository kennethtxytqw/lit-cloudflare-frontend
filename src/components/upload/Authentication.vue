<template>
  <div
    class="
      bg-gray-50
      w-2/3
      h-60
      rounded-b-3xl
      border-4 border-white
      text-black
      font-semibold
      m-auto
      flex flex-col
      justify-center
      items-center
    "
  >
    <fieldset>
      <legend>CloudFlare Settings</legend>
      <div class="settings__row">
        <p>Username</p>
        <input id="cf_username" type="text" v-model="email" />
      </div>
      <div class="settings__row">
        <p>Global API</p>
        <input id="cf_global_api" type="text" v-model="global_api" />
      </div>
      <div class="settings__row">
        <p>Account ID</p>
        <input
          id="cf_account_id"
          type="text"
          value="9b47beba2f167662ac16b81572ee529d"
        />
      </div>
      <div class="settings__save">
        <button @click="saveConfig">Save to Local Storage</button> <br />
        <button @click="login">Save to LIT Network</button>
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
    async loadJsScript(path) {
      var litJsScriptTags = document.createElement("script");
      litJsScriptTags.setAttribute("src", path);
      document.head.appendChild(litJsScriptTags);
    },
    saveConfig() {
      localStorage["cf_username"] =
        document.getElementById("cf_username").value;
      localStorage["cf_global_api"] =
        document.getElementById("cf_global_api").value;
      localStorage["cf_account_id"] =
        document.getElementById("cf_account_id").value;
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
            value: "0x32934dA17622faEb1F8c9fAb354fc194cF8e4378",
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

      // Decrypt
      const symmKey = window.litNodeClient.getEncryptionKey({
        accessControlConditions, // from a db
        toDecrypt: this.buf2hex(encryptedSymmetricKey.buffer), // from local storage
        chain: "ethereum",
        authSig,
      });
      const decryptedFiles = await LitJsSdk.decryptZip(
        encryptedZip,
        await symmKey
      );
      console.log(decryptedFiles);
      const decryptedString = await decryptedFiles["string.txt"].async("text");
      console.log(JSON.parse(atob(decryptedString)));
    },
  },
  async mounted() {
    // const email = localStorage["cf_username"];
    // const globalAPI = localStorage["cf_global_api"];
    // const accountId = "9b47beba2f167662ac16b81572ee529d"; //change this
    // const videoId = "0ae2a3f6e7f1a57d0bdfb0ba11be4521"; //change this
    // const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`;

    // // -- prepare request header
    // const options = {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-Auth-Email": email,
    //     "X-Auth-Key": globalAPI,
    //   },
    // };

    // // -- execute
    // const res = await fetch(url, options);
    // const result = await res.json();
    // console.log(result);
    // if (result.success === true) {
    //   this.loggedIn = true;
    // }
    await this.loadJsScript("https://jscdn.litgateway.com/index.web.js");

    setTimeout(() => {
      var litNodeClient = new LitJsSdk.LitNodeClient();
      litNodeClient.connect();
      window.litNodeClient = litNodeClient;
    }, 100);

    document.addEventListener(
      "lit-ready",
      function () {
        console.log("LIT network is ready");
      }.bind(this),
      false
    );
  },
};
</script>

<style lang="scss" scoped>
</style>