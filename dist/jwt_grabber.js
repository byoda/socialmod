var requestFilter = {
    urls: ["<all_urls>"]
},

extraInfoSpec = ['requestHeaders' ]


console.log('Adding listener');

chrome.webRequest.onSendHeaders.addListener(
    function(details) {
        console.log('Event triggered!');

        var headers = details.requestHeaders;
        var url = headers.url
        for (var i = 0, l = headers.length; i < l; ++i) {
            console.log('Header: ' + headers[i].name + ' --> ' + headers[i].value);
            if (headers[i].name === 'authorization') {
                console.log('JWT Token: ' + headers[i].value);
                // Send JWT Token to background.js
                // chrome.runtime.sendMessage({jwt: headers[i].value});
            }
        }
    },
    requestFilter,
    extraInfoSpec
);