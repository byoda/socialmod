<script lang='ts'>
    // export let target: HTMLElement;
    // export let props: Record<string, any>;

    import browser from 'webextension-polyfill';
    import {SocialNetwork} from './lib/datatypes';
    import {socialNetworks} from './lib/constants';
    import type {iListOfLists} from './lib/datatypes';
    import ByoList from './lib/list';
    import type {iByoList} from './lib/list';
    import ByoStorage from './lib/storage';
    import load_all_lists from './lib/util';

    const byo_storage: ByoStorage = new ByoStorage();

    let list_url: string = '';
    let listOfLists: iListOfLists  = byo_storage.load_list_of_lists_sync();
    console.log('Subscribed lists: ', listOfLists.lists);

    const load_lists = async() => {
        console.log('Loading lists');
        let allLists: Promise<Map<string, ByoList>> = load_all_lists(listOfLists.lists);
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
        listOfLists.lists.push(list_url);
        listOfLists = listOfLists;
        byo_storage.save_list_of_lists_sync(listOfLists);
        list_url = '';

    };

    const open_fullscreen = () => {
        browser.tabs.create({ url: browser.runtime.getURL('configure.html') });
    };
</script>

<main class='flex flex-col justify-center items-center'>
{#await load_lists()}
    <p>Loading lists...</p>
{:then lists}
    <p>Lists: {listOfLists.lists.length}</p>
    <table>
        <tr>
            <th>Lists</th>
            <th>Entries</th>
            <th></th>
            <th></th>
        </tr>
        {#each Array.from(listOfLists.lists) as list}
            <tr>
                <td>{list}</td>
                <td>{allLists.get(list).black_list.length}</td>
            </tr>
        {/each}
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
{/await}
</main>