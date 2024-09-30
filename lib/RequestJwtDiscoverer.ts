
// import url from 'url';
// import {URL, UrlWithParsedQuery} from 'url';

import {JWT, isJwt} from '../lib/Jwt.ts';
import RequestListener from '../lib/RequestListener.ts';


export default class RequestJwtDiscoverer {
    store: any;
    requestListener: RequestListener;

    constructor(store) {
        this.store = store;
        this.requestListener = new RequestListener();
    }

    start() {
        this.requestListener.on('request', (request) => {
            var jwts: JWT[] = [];

            // let parsedUrl = url.parse(request.url, true);

            let parsedUrl: URL = new URL(request.url);
            if (parsedUrl.searchParams) {
                for (let key in parsedUrl.searchParams) {
                    let value = parsedUrl.searchParams[key];
                    if (isJwt(value)) {

                        let jwt: JWT = new JWT(
                            'query_string', key, value, value
                        );
                        jwts.push(jwt);
                    }
                }
            }

            request.request.headers.forEach((header) => {
                let value = header.value;

                switch (header.name.toLowerCase()) {
                    case 'authorization':
                        let [type, innerValue] = value.split(' ', 2);
                        switch (type.toLowerCase()) {
                            case 'bearer':
                                value = innerValue;
                                break;
                        }
                        break;
                }

                if (isJwt(value)) {
                    let jwt: JWT = new JWT(
                        'request_header', header.name, value, header.value
                    )
                    jwts.push(jwt);
                }
            });

            let jwtVerified: boolean = false
            let value: string = '';
            let jwt: string | string [] = '';
            request.response.headers.forEach((header) => {
                value = header.value;

                switch (header.name.toLowerCase()) {
                    case 'location':
                        let parsedUrl: URL = new URL(value);

                        if (parsedUrl) {
                            if (parsedUrl.searchParams) {
                                for (let key in parsedUrl.searchParams) {
                                    let queryValue: string | string[] | undefined = parsedUrl.searchParams[key];
                                    if (isJwt(queryValue)) {
                                        jwtVerified = true;
                                        jwt = queryValue;
                                        break;
                                }
                            }

                            if (parsedUrl.hash && parsedUrl.hash.indexOf('#/?') === 0) {
                                let parsedHashUrl: url.UrlWithParsedQuery = url.parse(parsedUrl.hash.substring(3));
                                if (parsedHashUrl) {
                                    if (parsedHashUrl.query) {
                                        for (let key in parsedHashUrl.query) {
                                            let queryValue = parsedHashUrl.query[key];
                                            if (isJwt(queryValue)) {
                                                jwtVerified = true;
                                                value = queryValue;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                }

                if (jwtVerified || isJwt(header.value)) {
                    jwts.push(
                        {
                            type: 'response_header',
                            name: header.name,
                            value: value,
                            rawValue: header.value
                        }
                    );
                }
        });

        if (jwts.length > 0) {
            this.store.set({
                id: request.requestId,
                jwts: jwts,
                ...request
            });
            }
        });

        this.requestListener.start();
    }

    stop() {
    }
}
