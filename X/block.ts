
// # Twitter handle to user-id convertor:
// https://www.mediamister.com/find-twitter-user-id

// Instructions for setting up Visual Code for Browser Extension Development:
// https://code.visualstudio.com/docs/nodejs/browser-debugging
// https://code.visualstudio.com/Docs/languages/typescript

// 'Login' API call: https://api.x.com/1.1/onboarding/task.json
// @EndWokeness: 1552795969959636992

// import RequestDiscoverer from '../lib/RequestJwtDiscoverer.ts';
// import Store from '../lib/store.ts';

const user_id = '1552795969959636992'
const block_endpointURL = 'https://x.com/i/api/1.1/blocks/create.json';
const unblock_endpointURL = 'https://api.x.com/1.1/blocks/destroy.json';

const publicToken = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

export function getCsrf() {
    console.log("Getting CSRF!")
    let csrfToken = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
    return csrfToken ? csrfToken[1] : "";
}


window.onload = async () => {
    console.log('Page loaded!');

    // let store = new Store();
    // let disc = new RequestDiscoverer(store);
    try {
        console.log('URL:' + block_endpointURL);
        let csrfToken = getCsrf();
        const response = await fetch(
            block_endpointURL,
            {
                method: 'POST',
                headers: {
                    'authorization': publicToken,
                    'X-Csrf-Token': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Twitter-Active-User': 'yes',
                    'X-Twitter-Client-Language': 'en',
                    'X-Twitter-Auth-Type': 'OAuth2Session',
                    'X-Client-Transaction-Id': 'KV4OduB1PqQNoxbExJyKFtDSytBfTlHocq8hsUUkVw8XZyCSL9nSW7gFREuEoAmQPpqDtyu9M+SmxHEPnFnviUAGC9qsKg'
                },
                credentials: 'include',
                // Twitter POST body is plain text instead of form urlencoded
                // body: 'user_id=245963716'
                // body: 'screen_name=?EndWokeness'
                body: 'user_id=' + user_id
            }
        );
        if (response.status === 200) {
            let data = await response.json();
            console.log(data);
        } else if (response.status === 404) {
            console.log('User not found: ' + user_id);
        }
    } catch (e) {
        console.log(e);
    }
}
