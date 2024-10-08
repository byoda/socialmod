<script lang='ts'>
    // export let target: HTMLElement;
    // export let props: Record<string, any>;

    import browser from 'webextension-polyfill';
    import {SocialNetwork} from './lib/datatypes';
    import {socialNetworks} from './lib/constants';
    import type {iListOfLists} from './lib/datatypes';
    import ByoList from './lib/list';
    import ByoStorage from './lib/storage';

    const TestList: string = 'https://byomod.org/lists/dathes.yaml';
    const byo_storage: ByoStorage = new ByoStorage();

    let net: SocialNetwork = socialNetworks['x.com'];
    let key: string = net.get_keyname('my_lists');

    let list_url: string = '';
    let listOfLists: iListOfLists  = byo_storage.get_list_of_lists_sync(key);
    console.log('Subscribed lists: ', listOfLists.lists);
    if (! listOfLists) {
        listOfLists = { lists: new Set<string>() };
        byo_storage.set_list_of_lists_sync(key, listOfLists);
    }
    if (! listOfLists.lists) {
        listOfLists.lists = new Set<string>();
    }

    let mod_list: string;
    for (mod_list in listOfLists.lists) {
        console.log('found in storage: ', mod_list);
        try {
            let byo_list: ByoList = new ByoList(null, mod_list);
            try {
                byo_list.load();
            } catch (e) {
                console.error('Could not load from storage: ', mod_list);
                continue;
            }
        } catch (e) {
            console.error('Invalid URL: ', mod_list);
            continue;
        }
    }

    const add_list = () => {
        console.log('add_list: ', list_url);
        if (! list_url) return;

        if (list_url in listOfLists) {
            console.info('List already subscribed: ', list_url);
            return;
        }
        try {
            console.log('Adding list: ', list_url);
            new URL(list_url);
        } catch (e) {
            console.error('Invalid URL: ', list_url);
            return;
        };
        // Svelte trickery for updating lists:
        // https://learn.svelte.dev/tutorial/updating-arrays-and-objects
        listOfLists.lists.add(list_url);
        listOfLists = listOfLists;
        byo_storage.set_list_of_lists_sync(key, listOfLists);
        list_url = '';

    };

    const open_fullscreen = () => {
        browser.tabs.create({ url: browser.runtime.getURL('configure.html') });
    };
</script>

<main class='flex flex-col justify-center items-center'>
    <p>Top level {JSON.stringify(listOfLists)}</p>
    <p>Lists: {JSON.stringify(listOfLists.lists)}</p>
    <p>Subscribed lists: {listOfLists.lists.size}</p>
    {@debug}
    <table>
        <!-- {#each listOfLists.lists as list}
            <tr>
                <td>{list}</td>
            </tr>
        {/each} -->
    </table>
    <br/>
    <form on:submit|preventDefault={add_list} method="POST">
        <label>BYOMod list URL
            <input
                name='list_url'
                type='url'
                class='border-2 border-gray-300 p-2'
                placeholder='Enter a URL for a BYOMod list'
                bind:value={list_url}
            >
        </label>
    <button
          class='bg-blue-600 px-[6px] py-[14px] mt-6 text-white font-semibold'
        type='submit' formaction="?/add_list">Add</button
        >
    </form>
</main>