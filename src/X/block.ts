
// # Twitter handle to user-id convertor:
// https://www.mediamister.com/find-twitter-user-id

// Instructions for setting up Visual Code for Browser Extension Development:
// https://code.visualstudio.com/docs/nodejs/browser-debugging
// https://code.visualstudio.com/Docs/languages/typescript

// 'Login' API call: https://api.x.com/1.1/onboarding/task.json
// @EndWokeness: 1552795969959636992

import type {iMessage, iSocialNetworkAuth} from '../lib/datatypes';

const user_id: string = '1552795969959636992'
const block_endpointURL: string = 'https://x.com/i/api/1.1/blocks/create.json';
const unblock_endpointURL: string = 'https://api.x.com/1.1/blocks/destroy.json';

export function getCsrf() {
    console.log("Getting CSRF!")
    let csrfToken = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
    return csrfToken ? csrfToken[1] : "";
}


window.onload = async () => {
    console.log('Page loaded!');
    return;
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

chrome.runtime.onMessage.addListener(
    function(request: string, sender: object, sendResponse: Function) {
        try {
            let message = JSON.parse(request) as iMessage<iSocialNetworkAuth>;

            console.log(
                `Received message from ${message.source} type ${message.type}`
            );
            if (message.type === 'auth_tokens') {
                let data: iSocialNetworkAuth = message.data;
                if (data.name != 'Twitter') {
                    console.log(`We do not yet support social network: ${data.name}`);
                    return;
                }
                console.log(`Received auth_tokens: JWT: ${data.jwt}, CSRF Token: ${data.csrf_token}`);
                localStorage.setItem('socialmod_twitter_auth_tokens', request);
            }
        } catch (e) {
            console.log(
                `Invalid message: ${request}`
            );
        }
    }
);
