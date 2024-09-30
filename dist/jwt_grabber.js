var requestFilter = {
    urls: ["<all_urls>"]
},

extraInfoSpec = ['requestHeaders' ]


console.log('Adding listener');

chrome.webRequest.onSendHeaders.addListener(
    function(details) {
        console.log('Event triggered!');

        var headers = details.requestHeaders;
        var url = new URL(details.url)
        var hostname = url.hostname.toLowerCase();
        if (hostname.includes('x.com') || hostname.includes('twitter.com')) {
            console.log('Twitter: ' + url.hostname);
        } else if (hostname.includes('youtube.com')) {
            console.log('YouTube: ' + url.hostname);
        }

        for (var i = 0, l = headers.length; i < l; ++i) {
            if (headers[i].name === 'authorization') {
                console.log('JWT Token: ' + headers[i].value);
            }
            else if (headers[i].name === 'x-csrf-token') {
                console.log('CSRF Token: ' + headers[i].value);
            }
            // console.log('Header: ' + headers[i].name + ' --> ' + headers[i].value);

            // Send JWT Token to background.js
                // chrome.runtime.sendMessage({jwt: headers[i].value});
        }
    },
    requestFilter,
    extraInfoSpec
);