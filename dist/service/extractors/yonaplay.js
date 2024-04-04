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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
class Yonaplay {
}
_a = Yonaplay;
Yonaplay.extractYona = (id, key) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("3");
    try {
        var sorplay = (yield (yield fetch(atob(id) + "&apiKey=" + key, {
            headers: {
                Referer: "https://witanime.one/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            },
        })).text()).match(/go_to_player.*(https.*?)'/)[1];
        console.log(sorplay);
        var r = yield (yield fetch(sorplay, {
            headers: {
                Referer: "https://witanime.one/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            },
        })).text();
        return r.match(/file.*(https.*?)","/)[1];
    }
    catch (error) {
        return error;
    }
});
Yonaplay.extractAsnwish = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const r = yield (yield fetch("https://asnwish.com/e/" + id, {
            headers: {
                Referer: "https://witanime.one/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            },
        })).text();
        return r.match(/file.*(https.*?)"/)[1];
    }
    catch (error) {
        return error;
    }
});
exports.default = Yonaplay;
