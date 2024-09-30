console.log('Adding listener');

import {iMessage, iSocialNetworkAuth} from '../core/datatypes.ts';
import {SocialNetwork, socialNetworks} from '../core/datatypes.ts';

class AuthToken {
    type: string;
    value: string;
    expiration: number | null;

    constructor(type: string, value: string, expiration: number | null = null) {
        this.type = type;
        this.value = value;
        this.expiration = expiration;
    }
}

const TokenExpiration: number = 60 * 60 * 24;

let twitter_jwt: AuthToken | null = null;
let twitter_csrf_token: AuthToken | null = null;

function grab_auth_tokens(details: chrome.webRequest.WebRequestHeadersDetails) {
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
    // console.log(`JWT: ${network.jwt}, CSRF Token: ${network.csrf_token}`);
    if (network.jwt == null || network.csrf_token == null) {
        console.log('JWT or CSRF token not found!');
        return
    }

    let now: number = Math.round(Date.now() / 1000);
    now = 100000000000; // Force to always send the tokens, for testing

    if (network.name == 'Twitter') {
        if (twitter_jwt != null && twitter_csrf_token != null
                && twitter_csrf_token.expiration > now
                && twitter_jwt.expiration > now) {
            console.log('JWT and CSRF token already found for Twitter and they have not yet expired!');
            return;
        }
    } else {
        console.log(`We do not yet support social network: ${network.name}`);
        return;

    }
    (async () => {
        try {
            const [tab] = await chrome.tabs.query(
                {active: true, lastFocusedWindow: true}
            );
            if (tab == null) {
                console.log('No active tab found!');
            } else {
                let expires: number = now + TokenExpiration;
                let temp_twitter_jwt = new AuthToken('jwt', network.jwt, expires);
                let temp_twitter_csrf_token = new AuthToken('csrf', network.csrf_token, expires);

                let message: iMessage<iSocialNetworkAuth> = {
                    source: 'jwt_grabber',
                    type: 'auth_tokens',
                    data: network
                };
                console.log('Sending JWT and CSRF token to content script for tb.id: ' + tab.id);
                await chrome.tabs.sendMessage(tab.id, JSON.stringify(message));
                twitter_jwt = temp_twitter_jwt;
                twitter_csrf_token = temp_twitter_csrf_token
            }
        } catch (error) {
            console.log(`Error querying active tab: ${error}`);
            twitter_jwt = null;
            twitter_csrf_token = null;
        }
    })();
}

chrome.webRequest.onSendHeaders.addListener(
    grab_auth_tokens,
    {urls: ["<all_urls>"]},
    ['requestHeaders']
);