import express from "express";
import AnimepaheFetcher from "../service/animepahe";
import Anitaku from "../service/anitaku";

const router = express.Router();

const anime = new Anitaku();
router.get("/recent", (req, res) => {
  var page = req.query.page?.toString().trim();
  try {
    res.status(200);
    anime.recent(page).then((value) => res.json(value));
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
    anime.fetchSources(id ?? "jjk").then((value) => res.json(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});

export { router as anitakuRoute };
