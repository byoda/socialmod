/*!****************************!*\
  !*** ./jwt/jwt_grabber.ts ***!
  \****************************/
console.log('Adding listener');
var SocialNetwork = (function () {
    function SocialNetwork(name, url, jwt, csrf) {
        if (jwt === void 0) { jwt = null; }
        if (csrf === void 0) { csrf = null; }
        this.name = name;
        this.url = url;
        this.jwt = jwt;
        this.csrf = csrf;
    }
    return SocialNetwork;
}());
var socialNetworks = new Map();
socialNetworks.set('x.com', new SocialNetwork('Twitter', 'x.com'));
socialNetworks.set('youtube.com', new SocialNetwork('YouTube', 'youtube.com'));
socialNetworks.set('facebook.com', new SocialNetwork('Facebook', 'facebook.com'));
socialNetworks.set('instagram.com', new SocialNetwork('Instagram', 'instagram.com'));
chrome.webRequest.onSendHeaders.addListener(function (details) {
    console.log('Event triggered!');
    var url = new URL(details.url);
    var fqdn = url.hostname.toLowerCase();
    if (fqdn.includes('x.com') || fqdn.includes('twitter.com')) {
        console.log('Twitter: ' + fqdn);
    }
    else if (fqdn.includes('youtube.com')) {
        console.log('YouTube: ' + fqdn);
    }
    var fqdn_parts = fqdn.split('.');
    var tls = fqdn_parts[fqdn_parts.length - 1];
    var domain = fqdn_parts[fqdn_parts.length - 2];
    var social_domain = domain + '.' + tls;
    if (!(social_domain in socialNetworks)) {
        return;
    }
    var headers = details.requestHeaders;
    for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name === 'authorization') {
            console.log('JWT Token: ' + headers[i].value);
        }
        else if (headers[i].name === 'x-csrf-token') {
            console.log('CSRF Token: ' + headers[i].value);
        }
    }
}, {
    urls: ["<all_urls>"]
}, ['requestHeaders']);


//# sourceMappingURL=jwt_grabber.js.map