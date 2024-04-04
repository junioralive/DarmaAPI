// var express = require("express");
// const cherrio = require("cheerio");
// const path = require("path");
// const cors = require("cors");

// var app = express();

// var baseURL = "https://hdtoday.watch";

// app.get("/info/*", async (req, res) => {
//   var r = await fetch(`${baseURL}/${req.url.split("info/").pop()}`);

//   const html = await r.text();
//   const document = cherrio.load(html);

//   const data = {};

//   data["title"] = document(".detail-text > .caption > .caption-content")
//     .text()
//     .trim();
//   data["id"] = req.url.split("info/").pop();

//   data["token"] = document("#_token").attr("value");
//   data["poster"] = document(".app-player > img").attr("src");
//   data["cover"] = document(".media.media-cover")
//     .attr("style")
//     .split("(")
//     .pop()
//     .split(")")
//     .shift()
//     .toString();

//   document(".caption > .media-attr").each((index, element) => {
//     const temp = document(element)
//       .text()
//       .split("\n")
//       .map((e) => e.trim())
//       .filter((element) => element !== "");

//     data[temp.shift()] = temp.length === 1 ? temp[0] : temp;
//   });

//   data["type"] = data["id"].includes("show") ? "TV" : "Movie";

//   if (data["type"] === "TV") {
//     data["Seasons"] = document(".dropdown.episodes > .dropdown-menu")
//       .map((index, element) => {
//         return {
//           SeasonID: element.parent.attribs.id,
//           Episodes: document(element)
//             .find("button")
//             .map((index, b) => ({
//               title:
//                 b.children.length != 0
//                   ? b.children[0].data.split(":").pop().trim()
//                   : "null",
//               EpisodeID: b.attribs["data-key"],
//             }))
//             .get(),
//         };
//       })
//       .get();
//   } else {
//     data["episodeID"] = document("#video_key").attr("value");
//   }
//   res.statusCode = 200;
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   res.setHeader("Content-Type", "application/json");
//   res.json(data);
// });

// app.get("/watch", async (req, res) => {
//   const id = req.query.id;
//   const token = req.query.token;
//   try {
//     var r = await fetch(`https://hdtoday.watch/fetch/${id}?_token=${token}`);
//     var data = JSON.parse(await r.text());
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "application/json");
//     res.send(data);
//   } catch (e) {
//     res.statusCode = 404;
//     res.setHeader("Content-Type", "application/json");
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.send("{'status': 404, 'message':'Token expired! || Video Not found'}");
//   }
// });

// app.get("/search/:q", async (req, res) => {
//  var  url = `https://hdtoday.watch/search?query=${req.params.q}`;
//   var r = await fetch(url);
//   const _text = await r.text();
//   var $ = cherrio.load(_text);
//   var data = $(".app-section > .row > .col > .list-item")
//     .map((i, ele) => {
//       return {
//         id: $(ele).find("a").attr("href"),
//         title: $(ele).find(".list-title").text().trim(),
//         type: $(ele).find(".category").text().trim(),
//         rating: $(ele).find(".imdb").text().trim(),
//         year: $(ele).find(".list-year").text().split("•")[0].trim(),
//         cover: $(ele)
//           .find(".media-cover")
//           .attr("style")
//           .split("url('")
//           .pop()
//           .split("')")[0],
//       };
//     })
//     .get();
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "application/json");
//   res.send(data);
// });

// app.get("/xumo", async (req, res) => {
//   const url = req.query.url;
//   var r = await fetch(url);
//   const data = await r.text();
//   var $ = cherrio.load(data);
//   res.send(JSON.parse($("#__NEXT_DATA__").text()));
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "/index.html"));
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () =>
//   console.log(`Server running on ${port}, http://localhost:${port}`)
// );
