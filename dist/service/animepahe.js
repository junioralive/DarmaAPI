"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = __importStar(require("cheerio"));
class AnimepaheFetcher {
    constructor() {
        this.baseurl = "https://animepahe.ru";
        this.header = {
            Referer: "https://animepahe.ru/",
            Cookie: "__ddg2_=; __ddg1_=;",
        };
        this.fetchRecent = () => __awaiter(this, void 0, void 0, function* () {
            var r = yield fetch(this.baseurl + "/api?m=airing", {
                headers: this.header,
            }).then((v) => v.json());
            return r;
        });
        this.search = (q) => __awaiter(this, void 0, void 0, function* () {
            var r = yield fetch(this.baseurl + `/api?m=search&q=${q}`, {
                headers: this.header,
            }).then((v) => v.json());
            return r;
        });
        this.fetchInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            var data = yield fetch(this.baseurl + `/anime/${id}`, {
                headers: this.header,
            }).then((v) => v.text());
            const $ = cheerio.load(data);
            var info = {};
            info.title = $(".title-wrapper").find("h1 > span").text();
            info.image = $(".anime-poster").find("a").attr("href");
            info.desc = $(".anime-content > div > .anime-summary")
                .text()
                .replace("\n", "")
                .trim();
            info.romaji = $('.anime-info p:contains("Japanese:")')
                .text()
                .split(":")
                .pop();
            info.episodes = $('.anime-info p:contains("Episodes:")')
                .text()
                .split(":")
                .pop();
            info.status = (_a = $('.anime-info p:contains("Status:")')
                .text()
                .split(":")
                .pop()) === null || _a === void 0 ? void 0 : _a.replace("\n", "").trim();
            info.aniId = (_b = $('.anime-info a:contains("AniList")')
                .attr("href")) === null || _b === void 0 ? void 0 : _b.split("/").pop();
            info.tags = $(".anime-info .anime-genre ul li")
                .map((_, e) => $(e).text().trim())
                .get();
            info.recommendation = $(".anime-recommendation > div > .row")
                .map((_, e) => {
                var _a, _b, _c;
                return ({
                    id: (_a = $(e).children().first().find("a").attr("href")) === null || _a === void 0 ? void 0 : _a.split("/").pop(),
                    title: $(e).children().first().find("a").attr("title"),
                    image: $(e).children().first().find("a > img").attr("data-src"),
                    type: $(e).children().last().find("strong").text(),
                    episodes: (_b = $(e)
                        .children()
                        .last()
                        .text()
                        .match(/-\s(.*?)Episodes/)) === null || _b === void 0 ? void 0 : _b[1].trim(),
                    status: (_c = $(e)
                        .children()
                        .last()
                        .text()
                        .match(/\((.*?)\)/)) === null || _c === void 0 ? void 0 : _c[1].trim(),
                    year: $(e).children().last().children().last().text(),
                });
            })
                .get();
            info.relations = $(".anime-relation")
                .children()
                .find(".row.mx-n1")
                .map((_, e) => {
                var _a, _b, _c;
                return ({
                    id: (_a = $(e).children().first().find("a").attr("href")) === null || _a === void 0 ? void 0 : _a.split("/").pop(),
                    title: $(e).children().first().find("a").attr("title"),
                    image: $(e).children().first().find("a > img").attr("data-src"),
                    type: $(e).children().last().find("strong").text(),
                    episodes: (_b = $(e)
                        .children()
                        .last()
                        .text()
                        .match(/-\s(.*?)Episodes/)) === null || _b === void 0 ? void 0 : _b[1].trim(),
                    status: (_c = $(e)
                        .children()
                        .last()
                        .text()
                        .match(/\((.*?)\)/)) === null || _c === void 0 ? void 0 : _c[1].trim(),
                    year: $(e).children().last().children().last().text(),
                });
            })
                .get();
            info.episodes = yield this.fetchEpisodes(id);
            return info;
        });
        this.fetchEpisodes = (id, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                var r = (yield fetch(this.baseurl +
                    `/api?m=release&id=${id}&sort=episode_desc&page=${page}`, {
                    headers: this.header,
                }).then((v) => v.json())).data;
                var episodes = [];
                r.forEach((e) => {
                    episodes.push({
                        id: `/play/${id}/${e["session"]}`,
                        episode: e["episode"],
                        duration: e["duration"],
                        anime_id: e["anime_id"],
                        created_at: e["created_at"],
                        title: e["title"],
                        disc: e["disc"],
                        image: e["snapshot"],
                        type: e["audio"],
                    });
                });
                return episodes;
            }
            catch (e) {
                return { msg: "No Episodes found!" };
            }
        });
        this.fetchm3u8 = (id) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            const resp = yield fetch(this.baseurl + id, {
                headers: this.header,
            }).then((v) => v.text());
            var url = (_c = resp.match(/let url = "(.*)"/)) === null || _c === void 0 ? void 0 : _c[1];
            console.log(url);
            var r = yield fetch(url, {
                headers: {
                    Referer: this.baseurl,
                },
            }).then((v) => v.text());
            const link = eval(/(eval)(\(function[\s\S]*?)(<\/script>)/s.exec(r)[2].replace("eval", "")).match(/https.*?m3u8/)[0];
            return { url: link, thumbnail: (_d = resp.match(/https?:\/\/[^\s]*\.jpg/)) === null || _d === void 0 ? void 0 : _d[0] };
        });
    }
}
exports.default = AnimepaheFetcher;
