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
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const cheerio_1 = require("cheerio");
var key = crypto_js_1.default.enc.Utf8.parse("37911490979715163134003223491201");
var key2 = crypto_js_1.default.enc.Utf8.parse("54674138327930866480207815084989");
var iv = crypto_js_1.default.enc.Utf8.parse("3134003223491201");
class Anitaku {
    constructor() {
        this.baseURL = "https://anitaku.to/";
        this.fetchInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            var data = { id: id };
            var doc = yield (yield fetch(this.baseURL + "category/" + id)).text();
            const $ = (0, cheerio_1.load)(doc);
            data.cover = $(".anime_info_body_bg > img").attr("src");
            data.title = $(".anime_info_body_bg > h1").text();
            data.altTitle = $(".anime_info_body_bg  > .other-name > a")
                .map((_, e) => $(e).text().trim())
                .get();
            data.type = $(".type > span:contains('Type')").next().text();
            data.status = $(".type > span:contains('Status:')").next().text();
            data.year = (_a = $(".type:contains('Released:')")
                .text()
                .split(":")
                .pop()) === null || _a === void 0 ? void 0 : _a.trim();
            data.desc = $(".description").text();
            data.tags = $(".type:contains('Genre:') > a")
                .map((_, e) => $(e).text().replace(",", "").trim())
                .get();
            data.episodes = yield this._GetEpisodes($("#episode_page > li > a").first().text().split("-")[0], $("#episode_page > li > a").last().text().split("-").pop(), $("input#movie_id").val().toString());
            return data;
        });
        this._GetEpisodes = (ep_start, ep_end, movieId) => __awaiter(this, void 0, void 0, function* () {
            const url = `https://ajax.gogocdn.net/ajax/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${movieId}`;
            const data = yield (yield fetch(url)).text();
            const $ = (0, cheerio_1.load)(data);
            return $("li")
                .map((_, e) => {
                var _a, _b;
                return ({
                    id: $(e).find("a").attr("href").trim().substring(1),
                    episode: (_b = (_a = $(e).find(".name").text().split(" ").pop()) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "null",
                    type: $(e).find("div").last().text(),
                });
            })
                .get();
        });
        this.search = (q, page = "1") => __awaiter(this, void 0, void 0, function* () {
            var data = [];
            try {
                const res = yield axios_1.default.get(`${this.baseURL}/filter.html?keyword=${encodeURIComponent(q)}&page=${page}`);
                const $ = (0, cheerio_1.load)(res.data);
                data = $("div.last_episodes > ul > li")
                    .map((i, el) => {
                    var _a;
                    return ({
                        id: (_a = $(el).find("p.name > a").attr("href")) === null || _a === void 0 ? void 0 : _a.split("/")[2],
                        title: $(el).find("p.name > a").attr("title"),
                        cover: $(el).find("div > a > img").attr("src"),
                        year: $(el).find("p.released").text().trim(),
                        type: $(el).find("p.name > a").text().toLowerCase().includes("dub")
                            ? "DUB"
                            : "SUB",
                    });
                })
                    .get();
                return data;
            }
            catch (e) { }
            return data;
        });
        this.recent = (page = "1") => __awaiter(this, void 0, void 0, function* () {
            var data = [];
            try {
                const res = yield axios_1.default.get(`https://ajax.gogocdn.net/ajax/page-recent-release.html?page=${page}`);
                const $ = (0, cheerio_1.load)(res.data);
                $("div.last_episodes.loaddub > ul > li").each((i, el) => {
                    var _a, _b, _c;
                    data.push({
                        id: (_b = (_a = $(el)
                            .find("a")
                            .attr("href")) === null || _a === void 0 ? void 0 : _a.split("/")[1]) === null || _b === void 0 ? void 0 : _b.split("-episode")[0],
                        episodeId: (_c = $(el).find("a").attr("href")) === null || _c === void 0 ? void 0 : _c.split("/")[1],
                        totalEpisodes: parseFloat($(el).find("p.episode").text().replace("Episode ", "")),
                        title: $(el).find("p.name > a").attr("title"),
                        cover: $(el).find("div > a > img").attr("src"),
                    });
                });
            }
            catch (error) { }
            return data;
        });
        this.fetchSources = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                var resp = (yield axios_1.default.get(this.baseURL + id)).data;
                resp = (yield axios_1.default.get(resp.match(/<iframe.*(https.*?)"/)[1])).data;
                var d1 = crypto_js_1.default.AES.decrypt(resp.match(/data-value.*"(.*?)"/)[1], key, {
                    iv: iv,
                }).toString(crypto_js_1.default.enc.Utf8);
                var d2 = d1.substring(0, d1.indexOf("&"));
                var pramas = crypto_js_1.default.AES.encrypt(d2, key, { iv: iv }).toString() +
                    d1.substring(d1.indexOf("&")) +
                    "&alias=" +
                    d2;
                return JSON.parse(crypto_js_1.default.AES.decrypt((yield (0, axios_1.default)("https://embtaku.pro/encrypt-ajax.php?id=" + pramas, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                })).data.data, key2, { iv: iv }).toString(crypto_js_1.default.enc.Utf8)).source;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.default = Anitaku;
