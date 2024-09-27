// # Twitter handle to user-id convertor:
// https://www.mediamister.com/find-twitter-user-id
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Instructions for setting up Visual Code for Browser Extension Development:
// https://code.visualstudio.com/docs/nodejs/browser-debugging
// https://code.visualstudio.com/Docs/languages/typescript
// @EndWokeness: 1552795969959636992
// import RequestDiscoverer from '../lib/RequestJwtDiscoverer.ts';
var user_id = '1552795969959636992';
var block_endpointURL = 'https://x.com/i/api/1.1/blocks/create.json';
var unblock_endpointURL = 'https://api.x.com/1.1/blocks/destroy.json';
var publicToken = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
var csrfToken = 'd6330d41f0cc181504998f8b3285c43ef1619ba5e943949aa063837ff7a6c352907bd18e9d7a84c21e7a8b3796edfa321c17d4e6de2269f77c9bafdd92d447fcd797e36d04464e7e663fc585c81b8be0';
function log_msg(msg) {
    console.log(msg);
}
function getCsrf() {
    console.log("Getting CSRF!");
    // let csrf = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
    // return csrf ? csrf[1] : "";
    var csrfToken = '';
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === 'csrf-token') {
            csrfToken = metas[i].getAttribute('content');
            break;
        }
    }
    return csrfToken;
}
window.onload = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, data, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Page loaded!');
                // var manifest = chrome.runtime.getManifest();
                // let auth_header = 'Bearer ' + manifest.auth_header;
                // console.log('Auth Header: ' + auth_header);
                log_msg('msg');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                console.log('URL:' + block_endpointURL);
                return [4 /*yield*/, fetch(block_endpointURL, {
                        method: 'POST',
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
                    })];
            case 2:
                response = _a.sent();
                if (!(response.status === 200)) return [3 /*break*/, 4];
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                console.log(data);
                return [3 /*break*/, 5];
            case 4:
                if (response.status === 404) {
                    console.log('User not found: ' + user_id);
                }
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
