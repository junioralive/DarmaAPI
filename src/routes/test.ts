import { load } from "cheerio";
import express from "express";
import Yonaplay from "../service/extractors/yonaplay";
const router = express.Router();

router.get("/wish", async (req, res) => {
  var url = req.query.url?.toString();
  var referer = req.query.referer?.toString();
  res.json({
    src: await (
      await fetch(url!, {
        headers: {
          Referer: referer ?? "https://flaswish.com/",
          Cookie: "file_id=;aff=;",
        },
      })
    )
      .text()
      .then((res) => {
        return res;
      }),
    type: "m3u8",
    Referer: "",
  });
});
router.get("/witanime", async (req, res) => {
  var id = req.query.id?.toString();
  var provider = req.query.provider ?? "2";
  try {
    var r = await (
      await fetch("https://witanime.one/episode/" + id, {
        headers: {
          Referer: "https://witanime.one/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
      })
    ).text();

    const $ = load(r);

    var url =
      provider === "1"
        ? await Yonaplay.extractYona(
            $("#episode-servers > li:first").find("a").attr("data-url") ?? "",
            r.match(/apiKey.*"(.*?)"/)![1]
          )
        : await Yonaplay.extractAsnwish(
            atob(
              $("#episode-servers > li:last").find("a").attr("data-url") ?? ""
            )
              .split("/")
              .pop() ?? ""
          );
    res.json({
      url: url,
      type: "video/mp4",
    });
  } catch (error) {
    res.json({ msg: error });
  }
});
export { router as test };
