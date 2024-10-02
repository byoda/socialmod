var app = (function (exports) {
    'use strict';

    // # Twitter handle to user-id convertor:
    // https://www.mediamister.com/find-twitter-user-id
    const user_id = '1552795969959636992';
    const block_endpointURL = 'https://x.com/i/api/1.1/blocks/create.json';
    function getCsrf() {
        console.log("Getting CSRF!");
        let csrfToken = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
        return csrfToken ? csrfToken[1] : "";
    }
    window.onload = async () => {
        console.log('Page loaded!');
        try {
            console.log('URL:' + block_endpointURL);
            let csrfToken = getCsrf();
            let data_text = localStorage.getItem('socialmod_twitter_auth_tokens');
            if (data_text == null) {
                console.log('No auth tokens found!');
                return;
            }
            let data = JSON.parse(data_text);
            let publicToken = data.csrf_token;
            const response = await fetch(block_endpointURL, {
                method: 'POST', publicToken,
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
            });
            if (response.status === 200) {
                let data = await response.json();
                console.log(data);
            }
            else if (response.status === 404) {
                console.log('User not found: ' + user_id);
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        try {
            let message = JSON.parse(request);
            console.log(`Received message from ${message.source} type ${message.type}`);
            if (message.type === 'auth_tokens') {
                let data = message.data;
                if (data.name != 'Twitter') {
                    console.log(`We do not yet support social network: ${data.name}`);
                    return;
                }
                console.log(`Received auth_tokens: JWT: ${data.jwt}, CSRF Token: ${data.csrf_token}`);
                localStorage.setItem('socialmod_twitter_auth_tokens', JSON.stringify(data));
            }
        }
        catch (e) {
            console.log(`Invalid message: ${request}`);
        }
    });

    exports.getCsrf = getCsrf;

    return exports;

})({});
//# sourceMappingURL=socialmod.js.map
