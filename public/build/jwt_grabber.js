class SocialNetwork {
    name;
    url;
    jwt;
    csrf_token;
    constructor(name, url, jwt = undefined, csrf_token = undefined) {
        this.name = name;
        this.url = url;
        this.jwt = jwt;
        this.csrf_token = csrf_token;
    }
}
let socialNetworks = {
    'x.com': new SocialNetwork('Twitter', 'x.com'),
    'youtube.com': new SocialNetwork('YouTube', 'youtube.com'),
    'facebook.com': new SocialNetwork('Facebook', 'facebook.com'),
    'instagram.com': new SocialNetwork('Instagram', 'instagram.com')
};

console.log('Adding listener');
class AuthToken {
    type;
    value;
    expiration;
    constructor(type, value, expiration = undefined) {
        this.type = type;
        this.value = value;
        this.expiration = expiration;
    }
}
const TokenExpiration = 60 * 60 * 24;
let twitter_jwt = undefined;
let twitter_csrf_token = undefined;
function grab_auth_tokens(details) {
    let url = new URL(details.url);
    let fqdn = url.hostname.toLowerCase();
    let fqdn_parts = fqdn.split('.');
    if (fqdn_parts.length < 2) {
        console.log('Unsupported URL: ' + url.href);
        return;
    }
    let tld = fqdn_parts[fqdn_parts.length - 1];
    let domain = fqdn_parts[fqdn_parts.length - 2];
    let social_domain = `${domain}.${tld}`;
    if (!(social_domain in socialNetworks)) {
        console.log('Unsupported social network: ' + fqdn);
        return;
    }
    let network_auth = {
        name: socialNetworks[social_domain].name,
        jwt: undefined,
        csrf_token: undefined
    };
    let headers = details.requestHeaders;
    if (headers == undefined) {
        console.log('No headers found!');
        return;
    }
    for (let i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name === 'authorization') {
            network_auth.jwt = headers[i].value;
        }
        else if (headers[i].name === 'x-csrf-token') {
            network_auth.csrf_token = headers[i].value;
        }
    }
    if (network_auth.jwt == undefined || network_auth.csrf_token == undefined) {
        console.log(`Unauthenticated API call to ${url.href}`);
        return;
    }
    let now = Math.round(Date.now() / 1000);
    now = 100000000000; // Force to always send the tokens, for testing
    if (network_auth.name == 'Twitter') {
        if (twitter_jwt != undefined && twitter_csrf_token != undefined
            && twitter_csrf_token.expiration > now
            && twitter_jwt.expiration > now) {
            console.log('JWT and CSRF token already found for Twitter and they have not yet expired!');
            return;
        }
    }
    else {
        console.log(`We do not yet support social network: ${network_auth.name}`);
        return;
    }
    (async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab == undefined) {
                console.log('No active tab found!');
            }
            else {
                let expires = now + TokenExpiration;
                let temp_twitter_jwt = new AuthToken('jwt', network_auth.jwt, expires);
                let temp_twitter_csrf_token = new AuthToken('csrf', network_auth.csrf_token, expires);
                let message = {
                    source: 'jwt_grabber',
                    type: 'auth_tokens',
                    data: network_auth
                };
                if (tab == undefined) {
                    return;
                }
                console.log('Sending JWT and CSRF token to content script for tb.id: ' + tab.id);
                await chrome.tabs.sendMessage(tab.id, JSON.stringify(message));
                twitter_jwt = temp_twitter_jwt;
                twitter_csrf_token = temp_twitter_csrf_token;
            }
        }
        catch (error) {
            console.log(`Error querying active tab: ${error}`);
            twitter_jwt = undefined;
            twitter_csrf_token = undefined;
        }
    })();
}
chrome.webRequest.onSendHeaders.addListener(grab_auth_tokens, { urls: ["<all_urls>"] }, ['requestHeaders']);
//# sourceMappingURL=jwt_grabber.js.map
