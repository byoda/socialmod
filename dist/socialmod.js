/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
/*!********************!*\
  !*** ./X/block.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCsrf: () => (/* binding */ getCsrf)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
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
var user_id = '1552795969959636992';
var block_endpointURL = 'https://x.com/i/api/1.1/blocks/create.json';
var unblock_endpointURL = 'https://api.x.com/1.1/blocks/destroy.json';
var publicToken = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
function getCsrf() {
    console.log("Getting CSRF!");
    var csrfToken = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
    return csrfToken ? csrfToken[1] : "";
}
window.onload = function () { return __awaiter(void 0, void 0, void 0, function () {
    var csrfToken, response, data, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Page loaded!');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                console.log('URL:' + block_endpointURL);
                csrfToken = getCsrf();
                return [4, fetch(block_endpointURL, {
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
                        body: 'user_id=' + user_id
                    })];
            case 2:
                response = _a.sent();
                if (!(response.status === 200)) return [3, 4];
                return [4, response.json()];
            case 3:
                data = _a.sent();
                console.log(data);
                return [3, 5];
            case 4:
                if (response.status === 404) {
                    console.log('User not found: ' + user_id);
                }
                _a.label = 5;
            case 5: return [3, 7];
            case 6:
                e_1 = _a.sent();
                console.log(e_1);
                return [3, 7];
            case 7: return [2];
        }
    });
}); };


//# sourceMappingURL=socialmod.js.map