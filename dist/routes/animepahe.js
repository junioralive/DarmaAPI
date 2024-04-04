"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animepaheRoute = void 0;
const express_1 = __importDefault(require("express"));
const animepahe_1 = __importDefault(require("../service/animepahe"));
const router = express_1.default.Router();
exports.animepaheRoute = router;
const anime = new animepahe_1.default();
router.get("/recent", (req, res) => {
    try {
        res.status(200);
        anime.fetchRecent().then((value) => res.json(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
});
router.get("/search", (req, res) => {
    var _a;
    var q = (_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toString().trim();
    try {
        res.status(200);
        anime.search(q !== null && q !== void 0 ? q : "jjk").then((value) => res.json(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
});
router.get("/episodes", (req, res) => {
    var _a, _b;
    var id = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString().trim();
    var page = (_b = req.query.page) === null || _b === void 0 ? void 0 : _b.toString().trim();
    try {
        res.status(200);
        anime.fetchEpisodes(id !== null && id !== void 0 ? id : "", page).then((value) => res.json(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
});
router.get("/info", (req, res) => {
    var _a;
    var id = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString().trim();
    try {
        res.status(200);
        anime.fetchInfo(id !== null && id !== void 0 ? id : "jjk").then((value) => res.json(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
});
router.get("/watch", (req, res) => {
    var _a;
    var id = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString().trim();
    try {
        res.status(200);
        anime.fetchm3u8(id !== null && id !== void 0 ? id : "jjk").then((value) => res.json(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
});
