import AsianLoad from "../service";
import DramacoolFetcher from "../service/dramacool";
import express, { Request, Response } from "express";
const router = express.Router();

const dramacool = new DramacoolFetcher();

router.get("/trending", async (req, res) => {
  console.log("entered");

  var data = await dramacool.Trending();
  if (typeof data != "boolean") {
    res.send(data);
  } else {
    res.send({ Error: "Server Error!" });
  }
});

router.get("/info/", async (req, res) => {
  var q = req.query.id;
  try {
    if (typeof q == "string")
      await dramacool.fetchInfo(q).then((value) => {
        res.json(value);
      });
  } catch (e) {
    res.send("No data Found!!");
  }
});
router.get("/servers/", async (req, res) => {
  var q = req.query.id;
  try {
    if (typeof q == "string")
      await dramacool.fetchServers(q).then((value) => res.send(value));
  } catch (e) {
    res.send("No data Found!!");
  }
});
router.get("/watch/", async (req, res) => {
  var id = req.query.episodeId;
  var provider = req.query.provider;
  try {
    if (typeof id == "string") res.status(200);
    await dramacool
      .fetchStreamingLinks(id as string, provider as string)
      .then((value) => res.send(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});
router.get("/search/", async (req, res) => {
  var q = req.query.q?.toString().trim();
  var p = req.query.p?.toString().trim();
  try {
    res.status(200);
    await dramacool.search(q, p).then((value) => res.send(value));
  } catch (e) {
    res.status(404);
    res.send("No data Found!!");
  }
});
router.get("/recent", async (req, res) => {
  try {
    res.status(200);

    await dramacool.recent().then((value) => res.send(value));
  } catch (e) {
    res.status(404);

    res.send("No data Found!!");
  }
});
router.get("/popular", async (req, res) => {
  try {
    res.status(200);

    await dramacool.fetchPopular().then((value) => {
      res.send(value);
    });
  } catch (e) {
    res.status(404);

    res.send("No data Found!!");
  }
});
router.get("/actor/", async (req, res) => {
  var actorId = req.query.actorId?.toString().trim();
  res.header("Access-Control-Allow-Origin", "*");
  try {
    await dramacool.fetchActor(actorId!).then((value) => {
      res.status(200);
      res.send(value);
    });
  } catch (e) {
    res.status(404);

    res.send("No data Found!!");
  }
});

router.get("/asianload/", async (req, res) => {
  var id = req.query.id?.toString().trim();
  res.header("Access-Control-Allow-Origin", "*");
  try {
    res.json(await AsianLoad(id!));
  } catch (e) {
    res.status(404);

    res.send("No data Found!!");
  }
});

export { router as dramaRoutes };
