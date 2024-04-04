"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anitakuRoute = void 0;
const express_1 = __importDefault(require("express"));
const anitaku_1 = __importDefault(require("../service/anitaku"));
const router = express_1.default.Router();
exports.anitakuRoute = router;
const anime = new anitaku_1.default();
router.get("/recent", (req, res) => {
    var _a;
    var page = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString().trim();
    try {
        res.status(200);
        anime.recent(page).then((value) => res.json(value));
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
        anime.fetchSources(id !== null && id !== void 0 ? id : "jjk").then((value) => res.json(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
});
