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
exports.dramaRoutes = void 0;
const service_1 = __importDefault(require("../service"));
const dramacool_1 = __importDefault(require("../service/dramacool"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.dramaRoutes = router;
const dramacool = new dramacool_1.default();
router.get("/trending", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("entered");
    var data = yield dramacool.Trending();
    if (typeof data != "boolean") {
        res.send(data);
    }
    else {
        res.send({ Error: "Server Error!" });
    }
}));
router.get("/info/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var q = req.query.id;
    try {
        if (typeof q == "string")
            yield dramacool.fetchInfo(q).then((value) => {
                res.json(value);
            });
    }
    catch (e) {
        res.send("No data Found!!");
    }
}));
router.get("/servers/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var q = req.query.id;
    try {
        if (typeof q == "string")
            yield dramacool.fetchServers(q).then((value) => res.send(value));
    }
    catch (e) {
        res.send("No data Found!!");
    }
}));
router.get("/watch/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var id = req.query.episodeId;
    var provider = req.query.provider;
    try {
        if (typeof id == "string")
            res.status(200);
        yield dramacool
            .fetchStreamingLinks(id, provider)
            .then((value) => res.send(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
}));
router.get("/search/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    var q = (_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toString().trim();
    var p = (_b = req.query.p) === null || _b === void 0 ? void 0 : _b.toString().trim();
    try {
        res.status(200);
        yield dramacool.search(q, p).then((value) => res.send(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
}));
router.get("/recent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200);
        yield dramacool.recent().then((value) => res.send(value));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
}));
router.get("/popular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200);
        yield dramacool.fetchPopular().then((value) => {
            res.send(value);
        });
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
}));
router.get("/actor/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    var actorId = (_c = req.query.actorId) === null || _c === void 0 ? void 0 : _c.toString().trim();
    res.header("Access-Control-Allow-Origin", "*");
    try {
        yield dramacool.fetchActor(actorId).then((value) => {
            res.status(200);
            res.send(value);
        });
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
}));
router.get("/asianload/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    var id = (_d = req.query.id) === null || _d === void 0 ? void 0 : _d.toString().trim();
    res.header("Access-Control-Allow-Origin", "*");
    try {
        res.json(yield (0, service_1.default)(id));
    }
    catch (e) {
        res.status(404);
        res.send("No data Found!!");
    }
}));
