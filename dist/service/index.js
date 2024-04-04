"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const key = crypto_js_1.default.enc.Utf8.parse("93422192433952489752342908585752");
const iv = crypto_js_1.default.enc.Utf8.parse("9262859232435825");
const GenerateParams = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const data2 = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(msg, key, { iv }));
    const data3 = data2.substring(0, data2.indexOf("&"));
    return {
        params: `id=${encodeURIComponent(crypto_js_1.default.AES.encrypt(data3, key, { iv }).toString())}${data2.substring(data2.indexOf("&"))}&alias=${encodeURIComponent(data3)}`,
        downloadId: data2,
    };
});
const GetM3U8 = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    const requestData = yield GenerateParams(hash);
    const response = yield fetch(`https://pladrac.net/encrypt-ajax.php?${requestData.params}`);
    const responseData = yield response.json();
    const decryptedData = crypto_js_1.default.AES.decrypt(responseData.data, key, { iv });
    var data = JSON.parse(crypto_js_1.default.enc.Utf8.stringify(decryptedData));
    data["download"] =
        "https://pladrac.net/download?id=" + requestData.downloadId;
    return data;
});
const AsianLoad = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var resp = yield (yield fetch("https://dramacool.com.pa/" + id + ".html")).text();
    var presp = yield (yield fetch("https:" + resp.match(/src="([^"]*pladrac[^"]*)"/)[1])).text();
    const matchDataValue = presp.match(/data-value="(.*)"/)[1];
    if (presp && matchDataValue) {
        return yield GetM3U8(matchDataValue);
    }
    else {
        console.error("Error: Matching patterns not found.");
    }
});
exports.default = AsianLoad;
