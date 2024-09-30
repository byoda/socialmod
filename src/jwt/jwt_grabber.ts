console.log('Adding listener');


interface Dictionary<T> {
    [key: string]: T
}

class Message {
    source: string;
    type: string;
    data: SocialNetwork;

    constructor(source: string, type: string, data: SocialNetwork) {
        this.source = source;
        this.type = type;
        this.data = data;
    }
}



function grab_auth_tokens()

chrome.webRequest.onSendHeaders.addListener(
    function(details: chrome.webRequest.WebRequestHeadersDetails) {
        let url: URL = new URL(details.url)
        let fqdn: string = url.hostname.toLowerCase();

        let fqdn_parts: string[] = fqdn.split('.');
        if (fqdn_parts.length < 2) {
            console.log('Unsupported URL: ' + url.href);
            return
        }
        let tld: string = fqdn_parts[fqdn_parts.length - 1]
        let domain: string = fqdn_parts[fqdn_parts.length - 2]

        let social_domain: string = `${domain}.${tld}`;
        if (!(social_domain in socialNetworks)) {
            console.log('Unsupported social network: ' + fqdn);
            return
        }
        let network: SocialNetwork = socialNetworks[social_domain];

        let headers: chrome.webRequest.HttpHeader[] = details.requestHeaders;
        for (let i = 0, l = headers.length; i < l; ++i) {
            if (headers[i].name === 'authorization') {
                network.jwt = headers[i].value;
            }
            else if (headers[i].name === 'x-csrf-token') {
                network.csrf_token = headers[i].value;
            }
        }
        console.log(`JWT: ${network.jwt}, CSRF Token: ${network.csrf_token}`);
        if (network.jwt == null || network.csrf_token == null) {
            console.log('JWT or CSRF token not found!');
            return
        }
        (async () => {
            try {
                const [tab] = await chrome.tabs.query(
                    {active: true, lastFocusedWindow: true}
                );
                if (tab == null) {
                    console.log('No active tab found!');
                } else {
                    let message: Message = new Message('jwt_grabber', 'auth_tokens', network);
                    console.log('Sending JWT and CSRF token to content script for tb.id: ' + tab.id);
                    await chrome.tabs.sendMessage(tab.id, JSON.stringify(message));
                }
            } catch (error) {
                console.log('Error querying active tab: ' + error);
                return
            }

        })();
    },
    {
        urls: ["<all_urls>"]
    },
    ['requestHeaders']
);