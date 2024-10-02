<script lang="ts">
    import browser from "webextension-polyfill";
    export let name: string;
    const openFullscreen = () => {
        browser.tabs.create({ url: browser.runtime.getURL("dashboard.html") });
  };
  </script>

<main class="flex flex-col justify-center items-center">
  <h1 class="bg-blue-600">Hello {name} !!</h1>
  <button
    class="bg-blue-600 px-[6px] py-[14px] mt-6 text-white font-semibold"
    on:click={openFullscreen}>Click me</button
  >
</main>