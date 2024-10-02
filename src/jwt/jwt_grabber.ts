console.log('Adding listener');

import {iMessage, iSocialNetworkAuth} from '../lib/datatypes';
import {socialNetworks} from '../lib/datatypes';

class AuthToken {
    type: string;
    value: string;
    expiration: number | undefined;

    constructor(type: string, value: string, expiration: number | undefined = undefined) {
        this.type = type;
        this.value = value;
        this.expiration = expiration;
    }
}

const TokenExpiration: number = 60 * 60 * 24;

let twitter_jwt: AuthToken | undefined = undefined;
let twitter_csrf_token: AuthToken | undefined = undefined;

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

    let network_auth: iSocialNetworkAuth = {
        name: socialNetworks[social_domain].name,
        jwt: undefined,
        csrf_token: undefined
    };

    let headers: chrome.webRequest.HttpHeader[] | undefined = details.requestHeaders;
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
        console.log(
            `JWT ${network_auth.jwt} or CSRF token ${network_auth.csrf_token} not found!`
        );
        return
    }

    let now: number = Math.round(Date.now() / 1000);
    now = 100000000000; // Force to always send the tokens, for testing

    if (network_auth.name == 'Twitter') {
        if (twitter_jwt != undefined && twitter_csrf_token != undefined
                && twitter_csrf_token.expiration! > now
                && twitter_jwt.expiration! > now) {
            console.log('JWT and CSRF token already found for Twitter and they have not yet expired!');
            return;
        }
    } else {
        console.log(`We do not yet support social network: ${network_auth.name}`);
        return;

    }
    (async () => {
        try {
            const [tab] = await chrome.tabs.query(
                {active: true, lastFocusedWindow: true}
            );
            if (tab == undefined) {
                console.log('No active tab found!');
            } else {
                let expires: number = now + TokenExpiration;
                let temp_twitter_jwt = new AuthToken('jwt', network_auth.jwt!, expires);
                let temp_twitter_csrf_token = new AuthToken('csrf', network_auth.csrf_token!, expires);

                let message: iMessage<iSocialNetworkAuth> = {
                    source: 'jwt_grabber',
                    type: 'auth_tokens',
                    data: network_auth
                };
                if (tab == undefined) {
                    return;
                }
                console.log('Sending JWT and CSRF token to content script for tb.id: ' + tab.id);
                await chrome.tabs.sendMessage(tab.id!, JSON.stringify(message));
                twitter_jwt = temp_twitter_jwt;
                twitter_csrf_token = temp_twitter_csrf_token
            }
        } catch (error) {
            console.log(`Error querying active tab: ${error}`);
            twitter_jwt = undefined;
            twitter_csrf_token = undefined;
        }
    })();
}

chrome.webRequest.onSendHeaders.addListener(
    grab_auth_tokens,
    {urls: ["<all_urls>"]},
    ['requestHeaders']
);