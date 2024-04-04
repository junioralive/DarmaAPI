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
exports.test = void 0;
const cheerio_1 = require("cheerio");
const express_1 = __importDefault(require("express"));
const yonaplay_1 = __importDefault(require("../service/extractors/yonaplay"));
const router = express_1.default.Router();
exports.test = router;
router.get("/wish", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    var url = (_a = req.query.url) === null || _a === void 0 ? void 0 : _a.toString();
    var referer = (_b = req.query.referer) === null || _b === void 0 ? void 0 : _b.toString();
    res.json({
        src: yield (yield fetch(url, {
            headers: {
                Referer: referer !== null && referer !== void 0 ? referer : "https://flaswish.com/",
                Cookie: "file_id=;aff=;",
            },
        }))
            .text()
            .then((res) => {
            return res;
        }),
        type: "m3u8",
        Referer: "",
    });
}));
router.get("/witanime", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g;
    var id = (_c = req.query.id) === null || _c === void 0 ? void 0 : _c.toString();
    var provider = (_d = req.query.provider) !== null && _d !== void 0 ? _d : "2";
    try {
        var r = yield (yield fetch("https://witanime.one/episode/" + id, {
            headers: {
                Referer: "https://witanime.one/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            },
        })).text();
        const $ = (0, cheerio_1.load)(r);
        var url = provider === "1"
            ? yield yonaplay_1.default.extractYona((_e = $("#episode-servers > li:first").find("a").attr("data-url")) !== null && _e !== void 0 ? _e : "", r.match(/apiKey.*"(.*?)"/)[1])
            : yield yonaplay_1.default.extractAsnwish((_g = atob((_f = $("#episode-servers > li:last").find("a").attr("data-url")) !== null && _f !== void 0 ? _f : "")
                .split("/")
                .pop()) !== null && _g !== void 0 ? _g : "");
        res.json({
            url: url,
            type: "video/mp4",
        });
    }
    catch (error) {
        res.json({ msg: error });
    }
}));
