<script lang='ts'>
    // export let target: HTMLElement;
    // export let props: Record<string, any>;

    import browser from 'webextension-polyfill';
    import {SocialNetwork} from './lib/datatypes';
    import {socialNetworks} from './lib/constants';
    // import ByoList from './lib/list';
    import ByoStorage from './lib/storage';

    const TestList: string = 'https://byomod.org/lists/dathes.yaml';
    const byo_storage: ByoStorage = new ByoStorage();

    let net: SocialNetwork = socialNetworks['x.com'];
    let key: string = net.get_keyname('my_lists');

    let list_url: string = '';
    let subscribed_lists: string[] = [];
    // let subscribed_lists: [] = byo_storage.get_list_sync(key);

    let mod_list: string;
    // for (mod_list in subscribed_lists) {
    //     console.log('mod_list: ', mod_list);
    //     let byo_list: ByoList = new ByoList(net, mod_list);
    //     try {
    //         byo_list.load();
    //     } catch (e) {
    //         console.info('BYO List not in storage: ', mod_list);
    //         continue;
    //     }
    //     // let mod_list_key: string = net.get_keyname(mod_list);

    //     // mod_list_data = byo_storage.get_sync(mod_list_key);
    // }
    const add_list = () => {
        console.log('add_list: ', list_url);
        // if (! list_url) return;

        // try {
        //     new URL(list_url);
        // } catch (e) {
        //     console.error('Invalid URL: ', list_url);
        //     return;
        // }
        // Svelte trickery for updating lists:
        // https://learn.svelte.dev/tutorial/updating-arrays-and-objects
        subscribed_lists.push(list_url);
        subscribed_lists = subscribed_lists;
        // byo_storage.set_sync(key, subscribed_lists);
        list_url = '';

    };

    const open_fullscreen = () => {
        browser.tabs.create({ url: browser.runtime.getURL('configure.html') });
    };
</script>

<main class='flex flex-col justify-center items-center'>
    <p>Subscribed lists: {subscribed_lists.length}</p>
    <table>
        {#each subscribed_lists as list}
            <tr>
                <td>{list}</td>
            </tr>
        {/each}
    </table>
</main>