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
      h-72
      min-h-full
    "
  >
    <!-- LOADING -->
    <div v-if="loading">Loading...</div>

    <!-- LOADED -->
    <div v-if="!loading">
      <!-- If not connected to Metamask -->
      <div v-if="selectedAddress == null || !hasLitAuthSignature()" class="pt-24 pb-24">
        Please connect your wallet.
      </div>

      <!-- If Lit network is not ready, load spinner -->
      <div v-if="selectedAddress != null && !networkIsReady">
        <p class="text-center pt-14">Connecting to lit-protocol</p>
        <div class="flex justify-center items-center pb-14">
          <div
            class="
              animate-spin
              rounded-full
              h-16
              w-16
              my-2
              border-t-2 border-b-2 border-purple-500
            "
          ></div>
        </div>
      </div>

      <!-- If connected to Metamask -->
      <div v-if="selectedAddress != null && networkIsReady" class="my-6 flex">
        <div v-if="!kvRegistered" class="flex-1 pr-6">
          CloudFlare Email:
          <input
            type="text"
            placeholder="...enter your detail here"
            v-model="cfEmail"
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
          /><br />
          CloudFlare Global API:
          <input
            type="text"
            placeholder="...enter your detail here"
            v-model="cfGlobalAPI"
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
          /><br />
          <button
            @click="setValueToDB()"
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
              mt-2
            "
          >
            Save to KV DB
          </button>
        </div>
        <div class="flex-1 pl-6 flex flex-col justify-between">
          <p v-if="!kvRegistered">You're not registered on CloudFlare</p>

          <!-- Loading account -->
          <div v-if="kvRegistered && !loggedIn">
            <p class="text-center pt-14">Loading account</p>
            <div class="flex justify-center items-center pb-14">
              <div
                class="
                  animate-spin
                  rounded-full
                  h-16
                  w-16
                  my-2
                  border-t-2 border-b-2 border-purple-500
                "
              ></div>
            </div>
          </div>

          <p class="text-center" v-if="kvRegistered && loggedIn">Welcome back!<br> {{ selectedAddress }}</p>
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
              ease-linear
              transition-all
              duration-150
              mt-4
              m-auto
              w-28
            "
            v-if="loggedIn"
          >
            <p>
              <router-link to="/stream/upload">Next</router-link>
            </p>
          </button>
        </div>

        <!-- Register Email + Global API if not KV-registered -->
      </div>
    </div>

    <!-- If wallet address is found -->

    <!-- If logged in -->
  </div>
</template>

<script>
import {
  blobToDataURI,
  dataURItoBlob,
  arrayStringToUnit8Array,
  buf2hex,
} from "../../utils";

export default {
  name: "Authentication",
  data() {
    return {
      // component state
      networkIsReady: false,
      loggedIn: false,
      loading: false,

      // required data
      selectedChain: "ethereum",
      selectedAddress: null,
      kvRegistered: null,
      cfEmail: "lightanson@protonmail.com",
      cfGlobalAPI: "9e71cdc773da780e5059efe41ee0887d86b08",
    };
  },
  methods: {

    // ================== Local Component ==================
    // 
    // set if user is registered on CloudFlare KV
    // @params { Bool } true/false
    // @returns { void } 
    setKvRegistered(value) {
      this.kvRegistered = value;
    },

    //
    // set it is loading
    // @params { Bool } true/false
    // @returns { void } 
    //
    setLoading(value) {
      this.loading = value;
    },

    // ================== Lit-Protocol ==================
    //
    // Initalise LIT SDK
    // @returns { void } 
    //
    initLitSdk() {
      // if network is not ready
      if (!this.networkIsReady) {
        var litNodeClient = new LitJsSdk.LitNodeClient();
        litNodeClient.connect();
        window.litNodeClient = litNodeClient;
      }

      // -- listen if the network is ready
      document.addEventListener(
        "lit-ready",
        async function () {
          console.log("LIT network is ready");
          this.networkIsReady = true;
        }.bind(this),
        false
      );
    },

    // 
    // Check local storage if it hass the lit-auth signature
    // @returns { void } 
    //
    hasLitAuthSignature() {
      return localStorage["lit-auth-signature"] != null;
    },

    // 
    // Event:: when the lit-auth signature is signed
    // @params { Function } callback
    // @returns { void } 
    //
    onLitAuthSigned(callback) {
      var litSigned = setInterval(() => {
        if (this.hasLitAuthSignature()) {
          console.log("Signed!");
          callback();
          clearInterval(litSigned);
        }
      }, 100); // check every 100ms
    },

    //
    // return a fixed format of accessControlConditions
    // base on individual wallet
    // @param { String } chain : ethereum, polygon, etc.
    // @param { String } addr : wallet address
    // @returns { Object } an array of access control conditions
    //
    getIndividualWalletRequirement(chain, addr) {
      return [
        {
          contractAddress: "",
          standardContractType: "",
          chain: chain,
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: addr,
          },
        },
      ];
    },

    // ================== Metamask ==================

    // 
    // Set the selected wallet address to local state
    // @returns { void } 
    //
    setConnectedAddress() {
      this.selectedAddress = window.ethereum.selectedAddress;
    },
    
    // 
    // Event:: When user change its Metamask account
    // @params { Function } 
    // @returns { void } 
    //
    onMetamaskAccountChanged(callback) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length >= 1) {
          callback();
        }
      });
    },

    // ================== CloudFlare KV Databse ==================

    //
    // Get value from CloudFlare KV database
    // @param { String } addr - wallet address
    // @returns { String } base64 string consists of accessControlConditions
    // encryptedZip, and encryptedSymmetricKey
    //
    async getValueFromDB(addr) {
      console.warn("...getting value from database with addr: " + addr);

      const url = DEBUG ? API_DEV : API_PROD;
      const res = await fetch(`${url}/wallet/${addr}`);
      const data = await res.json();

      return data.kv;
    },

    //
    // Insert entry to DB
    // @returns { void } 
    //
    async setValueToDB() {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: this.selectedChain,
      });

      // -- prepare params
      const addr = this.selectedAddress;
      const accessControlConditions = this.getIndividualWalletRequirement(
        this.selectedChain,
        addr
      );
      const credential = {
        email: this.cfEmail,
        global_api: this.cfGlobalAPI,
      };
      const credential_base64 = btoa(JSON.stringify(credential));
      const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
        credential_base64
      );

      const encryptedSymmetricKey =
        await window.litNodeClient.saveEncryptionKey({
          accessControlConditions, // array of objects [{}]
          symmetricKey, // Unit8Array string
          authSig, // object
          chain: this.selectedChain, // string
        });

      const encryptedSymmetricKey_string = btoa(encryptedSymmetricKey);
      const encryptedZip_dataURI = await blobToDataURI(encryptedZip);

      // the value of the key/value database
      const value = btoa(
        JSON.stringify({
          accessControlConditions,
          encryptedZip: encryptedZip_dataURI,
          encryptedSymmetricKey: encryptedSymmetricKey_string,
        })
      );

      const url = DEBUG ? API_DEV : API_PROD;
      const header = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          // 'Content-Type': 'application/json'
          "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: value, // body data type must match "Content-Type" header
      };
      const path = `${url}/wallet/${addr}?c=${value}`;

      console.log(path);
      const res = await fetch(path, header);
      const data = await res.json();
      console.log(data);

      if (data.kv != null) {
        this.setLoading(true);

        setTimeout(() => {
          this.setLoading(false);
          this.init();
        }, 2000);
      }
    },

    //
    // Decrypt the encrypted base64 string credential
    // @params { String } base64 of "{email:'', globalAPI: ''}"
    // @returns { String } "{email:'', globalAPI: ''}"
    //
    async getDecryptedString(base64EncryptedCredential) {
      const chain = this.selectedChain;
      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain });

      const res = JSON.parse(atob(base64EncryptedCredential));
      const accessControlConditions = res.accessControlConditions;
      const toDecrypt = buf2hex(
        new Uint8Array(
          atob(res.encryptedSymmetricKey)
            .split(",")
            .map((x) => parseInt(x))
        )
      );
      const encryptedZip = dataURItoBlob(res.encryptedZip);

      await new Promise((r) => setTimeout(r, 1000));
      const decryptedSymmetricKey = await window.litNodeClient.getEncryptionKey(
        {
          accessControlConditions,
          toDecrypt,
          chain,
          authSig,
        }
      );

      const decryptedFiles = await LitJsSdk.decryptZip(
        encryptedZip,
        decryptedSymmetricKey
      );
      const decryptedString = await decryptedFiles["string.txt"].async("text");

      return decryptedString;
    },

    //
    // Get the encrypted credential
    // @returns { String } base64 of "{"email":"","globalAPI":""}"
    //
    async getEncryptedCredential() {
      // Check if it exists in the local storage
      const storedEncryptedCredential = localStorage["lit-encrypted-cred"];

      // If it contains a null value in String, remove the item
      if (storedEncryptedCredential == "null") {
        await localStorage.removeItem("lit-encrypted-cred");
      }

      // If it is, then return the value from local storage,
      if (
        storedEncryptedCredential != null &&
        storedEncryptedCredential != "null"
      ) {
        console.log("🤌 Storage version Credential");
        console.log("storedEncryptedCredential: ", storedEncryptedCredential);
        console.log(
          "(TYPE)storedEncryptedCredential: ",
          typeof storedEncryptedCredential
        );
        return storedEncryptedCredential;
      }

      // otherwise, we will try to get the value from the KV database
      let kvVersionCredential;

      try {
        kvVersionCredential = await this.getValueFromDB(this.selectedAddress);
        console.log("🤌 KV version Credential");
        console.log(kvVersionCredential);

        // save it to the localStorage so next time don't have to fetch from KV
        localStorage["lit-encrypted-cred"] = kvVersionCredential;
      } catch (e) {
        console.error(
          "🤌 Cannot find KV version credential, it probably doesn't exist! "
        );
      }

      return kvVersionCredential;
    },

    //
    // Get the decrypted credential
    // @returns { Object } eg. {email: "foo@bar.com", globalApi: "1234567"}
    //
    async getCredential() {
      // Get the encrypted credential in base64 String
      let base64EncryptedCredential = await this.getEncryptedCredential();

      // If failed to get the encrypted credential, return null
      if (
        base64EncryptedCredential == null ||
        base64EncryptedCredential == undefined
      ) {
        return null;
      }

      console.warn("base64:", base64EncryptedCredential);

      // Set if user is registered if the returned value is not null
      this.setKvRegistered(base64EncryptedCredential != null);

      // If user is not registered, then return null
      if (!this.kvRegistered) {
        return null;
      }

      // If user is registered though, then return the value
      const encryptedCredential = await this.getDecryptedString(
        base64EncryptedCredential
      );
      const credential = JSON.parse(atob(encryptedCredential));

      return credential;
    },

    // ================== Initialise ==================

    //
    // 1. Everytime it initialises, first we check if user has already requested
    // a lit-signature. If not, simply return.
    // 2. Then, we will set the selected wallet address we found in window.ethereum
    // 3. Then, we will try to find the credential from that wallet address
    // 4. If the credential exists, we can now use it to send requests
    // 5. Otherwise, save user to KV db.
    //
    async init() {
      if (!this.hasLitAuthSignature()) {
        return;
      }

      this.setConnectedAddress();

      const credential = await this.getCredential();

      if (credential == null) {
        console.warn(
          "🤌 Failed to get encrypted credential, time to store it on the KV database then!"
        );
        return;
      }

      console.log("🤌 Credential:", credential);
      this.loggedIn = true;
    },
  },

  // ================== Mounted Hook ==================
  async mounted() {
    this.onLitAuthSigned(() => {
      this.initLitSdk();
      this.init();

      this.onMetamaskAccountChanged(() => {
        // clear the saved credential
        localStorage.removeItem("lit-encrypted-cred");
        this.kvRegistered = false;
        this.init();
      });
    });
  },
};
</script>

