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
class DramacoolFetcher {
    constructor() {
        this.baseURL = "https://dramacool.pa/";
        this.fetchInfo = (url) => __awaiter(this, void 0, void 0, function* () {
            if (!url.includes("https")) {
                url = this.baseURL + url;
            }
            try {
                const v = yield (yield fetch(url, {
                    referrer: this.baseURL,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
                    },
                })).text();
                const $ = cheerio.load(v);
                let info = {
                    id: "",
                    title: "",
                };
                info.title = $(".info h1").text();
                info.altTitles = $(".other_name")
                    .find("a")
                    .map((_, e) => $(e).text())
                    .get();
                info.id = url;
                info.image = $(".details > .img > img").attr("src");
                info.trailer = $(".trailer > iframe").attr("src");
                info.description = $(".info")
                    .find("p:not(:has(span))")
                    .map((_, e) => $(e).text().trim())
                    .get()
                    .join("\n")
                    .trim();
                info.year = $('.info p:contains("Released:")')
                    .text()
                    .split("\n")[1]
                    .trim();
                info.country = $('.info p:contains("Country:") > a').text();
                info.status = $('.info p:contains("Status:")')
                    .text()
                    .split("\n")[1]
                    .trim();
                info.genre = $(".info p:last > a")
                    .map((_, e) => $(e).text())
                    .get();
                info.actors = [];
                $(".slider-star > div").each((_, e) => {
                    var _a;
                    (_a = info.actors) === null || _a === void 0 ? void 0 : _a.push({
                        name: $(e).find(".title").text().trim(),
                        image: $(e).find("img").attr("src"),
                        id: $(e).find("a").attr("href"),
                    });
                });
                info.totalEpisodes = $(".all-episode > li").length;
                info.episodes = [];
                $(".all-episode > li").each((i, e) => {
                    var _a;
                    (_a = info.episodes) === null || _a === void 0 ? void 0 : _a.push({
                        id: $(e).find("a").attr("href"),
                        name: $(e).find(".title").text().trim(),
                        type: $(e).find(".type").text().trim(),
                        date: $(e).find(".time").text().trim(),
                    });
                });
                return info;
            }
            catch (e) {
                console.error(e);
            }
            return "No Data Found!";
        });
        this.Trending = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const v = yield (yield fetch(this.baseURL, {
                    redirect: "follow",
                    referrer: this.baseURL,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
                    },
                })).text();
                const $ = cheerio.load(v);
                var data = [];
                console.log($("#layerslider > .ls-slide").children().length);
                $("#layerslider .ls-slide").each((i, e) => {
                    var _item = {
                        id: "",
                    };
                    _item.id = $(e).find("a").attr("href");
                    _item.title = $(e).find("img").attr("title");
                    _item.description = "";
                    _item.image = $(e).find("img").attr("src");
                    data.push(_item);
                });
                return data;
            }
            catch (e) {
                console.log(e);
            }
            return false;
        });
        this.fetchServers = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const v = yield (yield fetch(`${this.baseURL}/${id}`, {
                    redirect: "follow",
                    referrer: this.baseURL,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
                    },
                })).text();
                const $ = cheerio.load(v);
                var data = [];
                $(".anime_muti_link > ul > li").each((i, e) => {
                    var _a;
                    data.push({
                        name: $(e).text().replace("Choose this server", "").trim(),
                        url: (_a = $(e).attr("data-video")) === null || _a === void 0 ? void 0 : _a.trim(),
                    });
                });
                return data;
            }
            catch (e) {
                console.log(e);
            }
            return false;
        });
        this.fetchStreamingLinks = (id, provider) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const R = yield (yield fetch(`${this.baseURL}/${id}`, {
                    redirect: "follow",
                    headers: {
                        Referer: this.baseURL,
                        "Access-Control-Allow-Origin": "*",
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
                    },
                })).text();
                if (provider === "streamtape") {
                    var streamtape = R.match(/<li class="streamtape" rel="\d+" data-video="([^"]+)">/)[1];
                    var streamtResp = yield fetch(streamtape).then((value) => value.text());
                    var _result = {
                        src: "https:" +
                            eval((_a = streamtResp.match(/captchalink'\).innerHTML = (.*);/)) === null || _a === void 0 ? void 0 : _a[1]) +
                            "&stream=1",
                        type: "video/mp4",
                    };
                    return _result;
                }
                const u = provider === "doody"
                    ? R.match(/<li class="doodstream" rel="\d+" data-video="([^"]+)">/)[1]
                    : R.match(/<li class="streamwish" rel="\d+" data-video="([^"]+)">/)[1];
                console.log(u);
                return provider === "doody"
                    ? yield this.doody(u.split("/e/").pop())
                    : {
                        src: yield (yield fetch(u, { headers: { Referer: this.baseURL } }))
                            .text()
                            .then((res) => { var _a; return ((_a = res.match(/file:\s*"([^"]+)"/)) === null || _a === void 0 ? void 0 : _a[1]) + ""; }),
                        type: "m3u8",
                        Referer: "",
                    };
            }
            catch (e) {
                console.log(e);
                return "Not found!";
            }
        });
        this.doody = (id) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            const doodurl = "https://d0000d.com";
            try {
                const v = yield fetch(doodurl + "/e/" + id.split("/e/").pop(), {
                    redirect: "follow",
                    headers: { Referer: doodurl },
                });
                console.log(v.status);
                const resp = yield v.text();
                const pre = yield (yield fetch(doodurl +
                    "/pass_md5/" +
                    ((_b = /\$.get\('\/pass_md5\/([^']+)'/.exec(resp)) === null || _b === void 0 ? void 0 : _b[1]), { headers: { Referer: doodurl } })).text();
                console.log(pre);
                if (resp.includes("src: data + makePlay()")) {
                    return {
                        src: pre +
                            eval(`(${(_c = /function\s+makePlay\(\)\s*{([^}]*)}/.exec(resp)) === null || _c === void 0 ? void 0 : _c[0]})()`),
                        type: pre.includes("m3u8") ? "m3u8" : "video/mp4",
                        Referer: doodurl,
                    };
                }
                return {
                    src: pre,
                    type: pre.includes("m3u8") ? "m3u8" : "video/mp4",
                    Referer: doodurl,
                };
            }
            catch (error) {
                console.error("Error fetching data:", error);
                return { src: "Not found" };
            }
        });
        this.search = (q, page) => __awaiter(this, void 0, void 0, function* () {
            var url = `https://asianwiki.co/search?keyword=${q}&page=${page}`;
            const r = yield (yield fetch(url, {
                redirect: "follow",
                referrer: this.baseURL,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
                },
            })).text();
            const $ = cheerio.load(r);
            var data = [];
            $(".content-l-item > .col-2 > li").each((i, e) => {
                var _a;
                data.push({
                    id: (_a = $(e)
                        .find("a")
                        .attr("href")) === null || _a === void 0 ? void 0 : _a.replace("asian-wiki", "drama-detail").replace(".html", "").trim(),
                    image: $(e).find("img").attr("src"),
                    title: $(e).find("h3").text(),
                    status: $(e).find(".meta > span").last().text(),
                    year: $(e).find(".meta > span").first().text(),
                    country: $(e).find(".meta > span").last().prev().text(),
                });
            });
            return data;
        });
        this.recent = () => __awaiter(this, void 0, void 0, function* () {
            const v = yield (yield fetch(this.baseURL, {
                redirect: "follow",
                referrer: this.baseURL,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
                },
            })).text();
            var data = [];
            const $ = cheerio.load(v);
            $(".list-episode-item > li").each((i, e) => {
                var _item = {
                    id: $(e).find("a").attr("href"),
                    image: $(e).find("img").attr("data-original"),
                    title: $(e).find("h3").text(),
                    type: $(e).find(".type").text(),
                    time: $(e).find(".time").text(),
                    epsNumber: parseInt($(e).find(".ep").text().split(" ")[1]),
                };
                data.push(_item);
            });
            return data;
        });
        this.fetchPopular = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const r = yield (yield fetch("https://asianwiki.co/most-watched.html")).text();
                const $ = cheerio.load(r);
                var data = [];
                $(".content-l-item > .col-2 > li").each((i, e) => {
                    var _a;
                    data.push({
                        id: (_a = $(e)
                            .find("a")
                            .attr("href")) === null || _a === void 0 ? void 0 : _a.replace("asian-wiki", "drama-detail").replace(".html", "").trim(),
                        image: $(e).find("img").attr("src"),
                        title: $(e).find("h3").text(),
                        status: $(e).find(".meta > span").last().text(),
                        year: $(e).find(".meta > span").first().text(),
                        country: $(e).find(".meta > span").last().prev().text(),
                    });
                });
                return data;
            }
            catch (e) { }
            return [];
        });
        this.fetchActor = (id) => __awaiter(this, void 0, void 0, function* () {
            var actor = { id: id };
            id = id.endsWith(".html") ? id : id + ".html";
            const v = yield (yield fetch("https://asianwiki.co/" + id)).text();
            const $ = cheerio.load(v);
            actor.name = $(".content-l-item")
                .find(".info-drama > h1")
                .text()
                .replace(RegExp(/\([0-9].*\)/), "");
            actor.otherNames = $(".content-l-item > .info-drama > .other_name > a")
                .map((i, e) => e.attribs["title"])
                .toArray();
            actor.age = $(".other_name").next().text().replace("Age:", "").trim();
            actor.dob = $(".info-drama > div:contains('Born:') ")
                .text()
                .replace("Born:", "")
                .trim();
            actor.height = $(".info-drama > div:contains('Height:') ")
                .text()
                .replace("Height:", "")
                .trim();
            actor.nationality = $(".info-drama > div:contains('Nationality:') ")
                .text()
                .replace("Nationality:", "")
                .trim();
            actor.image = $(".content-l-item > .thumb-drama").attr("src");
            actor.about = $(".info-drama > div").last().text();
            actor.movies = [];
            $(".content-l-item > .col-2 > li").each((i, e) => {
                var _a;
                actor.movies.push({
                    id: (_a = $(e)
                        .find("a")
                        .attr("href")) === null || _a === void 0 ? void 0 : _a.replace("asian-wiki", "drama-detail").replace(".html", "").trim(),
                    image: $(e).find("a > img").attr("src"),
                    title: $(e).find("h3").text(),
                    status: $(e).find(".meta > span").last().text(),
                    year: $(e).find(".meta > span").first().text(),
                    country: $(e).find(".meta > span").last().prev().text(),
                });
            });
            return actor;
        });
    }
}
exports.default = DramacoolFetcher;
