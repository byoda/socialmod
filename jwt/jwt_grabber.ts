console.log('Adding listener');



class SocialNetwork {
    name: string;
    url: string;
    jwt: string | null;
    csrf: string | null;

    constructor(name: string, url: string, jwt: string | null = null, csrf: string | null = null) {
        this.name = name;
        this.url = url;
        this.jwt = jwt;
        this.csrf = csrf;
    }
}

let socialNetworks: Map<string, SocialNetwork> = new Map()
socialNetworks.set('x.com', new SocialNetwork('Twitter', 'x.com'));
socialNetworks.set('youtube.com', new SocialNetwork('YouTube', 'youtube.com'));
socialNetworks.set('facebook.com', new SocialNetwork('Facebook', 'facebook.com'));
socialNetworks.set('instagram.com', new SocialNetwork('Instagram', 'instagram.com'));

chrome.webRequest.onSendHeaders.addListener(
    function(details: chrome.webRequest.WebRequestHeadersDetails) {
        console.log('Event triggered!');

        let url: URL = new URL(details.url)
        let fqdn: string = url.hostname.toLowerCase();
        if (fqdn.includes('x.com') || fqdn.includes('twitter.com')) {
            console.log('Twitter: ' + fqdn);
        } else if (fqdn.includes('youtube.com')) {
            console.log('YouTube: ' + fqdn);
        }

        let fqdn_parts: string[] = fqdn.split('.');
        let tls: string = fqdn_parts[fqdn_parts.length - 1]
        let domain: string = fqdn_parts[fqdn_parts.length - 2]
        let social_domain: string = domain + '.' + tls
        if (!(social_domain in socialNetworks)) {
            return
        }

        let headers: chrome.webRequest.HttpHeader[] = details.requestHeaders;
        for (let i = 0, l = headers.length; i < l; ++i) {
            if (headers[i].name === 'authorization') {
                console.log('JWT Token: ' + headers[i].value);
                socialNetworks.get(social_domain)?.jwt = headers[i].value;
            }
            else if (headers[i].name === 'x-csrf-token') {
                console.log('CSRF Token: ' + headers[i].value);
            }
            // console.log('Header: ' + headers[i].name + ' --> ' + headers[i].value);

            // Send JWT Token to background.js
                // chrome.runtime.sendMessage({jwt: headers[i].value});
        }
    },
    {
        urls: ["<all_urls>"]
    },
    ['requestHeaders']
);