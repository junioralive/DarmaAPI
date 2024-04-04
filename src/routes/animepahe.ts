import express from "express";
import AnimepaheFetcher from "../service/animepahe";

const router = express.Router();

const anime = new AnimepaheFetcher();
router.get("/recent", (req, res) => {
  try {
    res.status(200);
    anime.fetchRecent().then((value) => res.json(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});
router.get("/search", (req, res) => {
  var q = req.query.q?.toString().trim();
  try {
    res.status(200);
    anime.search(q ?? "jjk").then((value) => res.json(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});
router.get("/episodes", (req, res) => {
  var id = req.query.id?.toString().trim();
  var page = req.query.page?.toString().trim();
  try {
    res.status(200);
    anime.fetchEpisodes(id ?? "", page).then((value) => res.json(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});
router.get("/info", (req, res) => {
  var id = req.query.id?.toString().trim();
  try {
    res.status(200);
    anime.fetchInfo(id ?? "jjk").then((value) => res.json(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});
router.get("/watch", (req, res) => {
  var id = req.query.id?.toString().trim();
  try {
    res.status(200);
    anime.fetchm3u8(id ?? "jjk").then((value) => res.json(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});

export { router as animepaheRoute };
