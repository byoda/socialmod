<script lang="ts">
    import browser from "webextension-polyfill";
    import {SocialNetwork, socialNetworks} from "./datatypes";

    const openFullscreen = () => {
        browser.tabs.create({ url: browser.runtime.getURL("dashboard.html") });
    };
    let net: SocialNetwork = socialNetworks['Twitter'];
    let key: string = net.get_keyname('my_lists);')
  </script>

<main class="flex flex-col justify-center items-center">
  <h1 class="bg-blue-600">Bring Your Own Content Moderation</h1>
  <button
    class="bg-blue-600 px-[6px] py-[14px] mt-6 text-white font-semibold"
    on:click={openFullscreen}>Click me</button
  >
</main>