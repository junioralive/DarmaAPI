import * as cheerio from "cheerio";
import { Actor, Drama, Provider } from "../model/Drama";
// import fetchm3u8 from "./test";

interface FetchResult {
  src: string;
  type?: string;
  Referer?: string;
}

export default class DramacoolFetcher {
  protected baseURL = "https://dramacool.pa/";

  fetchInfo = async (url: string): Promise<Drama | String> => {
    if (!url.includes("https")) {
      url = this.baseURL + url;
    }

    try {
      const v = await (
        await fetch(url, {
          referrer: this.baseURL,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
          },
        })
      ).text();
      const $ = cheerio.load(v);

      let info: Drama = {
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
        info.actors?.push({
          name: $(e).find(".title").text().trim(),
          image: $(e).find("img").attr("src"),
          id: $(e).find("a").attr("href"),
        });
      });
      info.totalEpisodes = $(".all-episode > li").length;
      info.episodes = [];
      $(".all-episode > li").each((i: number, e: cheerio.Element) => {
        info.episodes?.push({
          id: $(e).find("a").attr("href")!,
          name: $(e).find(".title").text().trim(),
          type: $(e).find(".type").text().trim(),
          date: $(e).find(".time").text().trim(),
        });
      });

      return info;
    } catch (e) {
      console.error(e);
    }

    return "No Data Found!";
  };

  Trending = async (): Promise<Drama[] | boolean> => {
    try {
      const v = await (
        await fetch(this.baseURL, {
          redirect: "follow",
          referrer: this.baseURL,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
          },
        })
      ).text();
      const $ = cheerio.load(v);

      var data: Drama[] = [];
      console.log($("#layerslider > .ls-slide").children().length);

      $("#layerslider .ls-slide").each((i: number, e: cheerio.Element) => {
        var _item: Drama = {
          id: "",
        };
        _item.id = $(e).find("a").attr("href")!;
        _item.title = $(e).find("img").attr("title");
        _item.description = "";
        _item.image = $(e).find("img").attr("src");
        data.push(_item);
      });
      return data;
    } catch (e) {
      console.log(e);
    }
    return false;
  };
  fetchServers = async (id: string): Promise<boolean | Provider[]> => {
    try {
      const v = await (
        await fetch(`${this.baseURL}/${id}`, {
          redirect: "follow",
          referrer: this.baseURL,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
          },
        })
      ).text();
      const $ = cheerio.load(v);
      var data: Provider[] = [];
      $(".anime_muti_link > ul > li").each((i: number, e: cheerio.Element) => {
        data.push({
          name: $(e).text().replace("Choose this server", "").trim(),
          url: $(e).attr("data-video")?.trim()!,
        });
      });
      return data;
    } catch (e) {
      console.log(e);
    }

    return false;
  };

  fetchStreamingLinks = async (
    id: string,
    provider: string
  ): Promise<FetchResult | string> => {
    try {
      const R = await (
        await fetch(`${this.baseURL}/${id}`, {
          redirect: "follow",
          headers: {
            Referer: this.baseURL,
            "Access-Control-Allow-Origin": "*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
          },
        })
      ).text();
      if (provider === "streamtape") {
        var streamtape = R.match(
          /<li class="streamtape" rel="\d+" data-video="([^"]+)">/
        )![1];
        var streamtResp = await fetch(streamtape).then((value) => value.text());
        var _result: FetchResult = {
          src:
            "https:" +
            eval(streamtResp.match(/captchalink'\).innerHTML = (.*);/)?.[1]!) +
            "&stream=1",
          type: "video/mp4",
        };
        return _result;
      }
      const u =
        provider === "doody"
          ? R.match(
              /<li class="doodstream" rel="\d+" data-video="([^"]+)">/
            )![1]
          : R.match(
              /<li class="streamwish" rel="\d+" data-video="([^"]+)">/
            )![1];
      console.log(u);

      return provider === "doody"
        ? await this.doody(u.split("/e/").pop()!)
        : {
            src: await (await fetch(u, { headers: { Referer: this.baseURL } }))
              .text()
              .then((res) => res.match(/file:\s*"([^"]+)"/)?.[1] + ""),
            type: "m3u8",
            Referer: "",
          };
    } catch (e) {
      console.log(e);
      return "Not found!";
    }
  };
  doody = async (id: string): Promise<FetchResult> => {
    const doodurl = "https://d0000d.com";

    try {
      const v = await fetch(doodurl + "/e/" + id.split("/e/").pop(), {
        redirect: "follow",
        headers: { Referer: doodurl },
      });
      console.log(v.status);
      const resp = await v.text();
      const pre = await (
        await fetch(
          doodurl +
            "/pass_md5/" +
            /\$.get\('\/pass_md5\/([^']+)'/.exec(resp)?.[1],
          { headers: { Referer: doodurl } }
        )
      ).text();
      console.log(pre);

      if (resp.includes("src: data + makePlay()")) {
        return {
          src:
            pre +
            eval(
              `(${/function\s+makePlay\(\)\s*{([^}]*)}/.exec(resp)?.[0]})()`
            ),
          type: pre.includes("m3u8") ? "m3u8" : "video/mp4",
          Referer: doodurl,
        };
      }

      return {
        src: pre,
        type: pre.includes("m3u8") ? "m3u8" : "video/mp4",
        Referer: doodurl,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { src: "Not found" };
    }
  };

  search = async (q?: string, page?: string): Promise<boolean | Drama[]> => {
    var url = `https://asianwiki.co/search?keyword=${q}&page=${page}`;

    const r = await (
      await fetch(url, {
        redirect: "follow",
        referrer: this.baseURL,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
        },
      })
    ).text();

    const $ = cheerio.load(r);
    var data: Drama[] = [];

    $(".content-l-item > .col-2 > li").each((i: number, e: cheerio.Element) => {
      data.push({
        id: $(e)
          .find("a")
          .attr("href")
          ?.replace("asian-wiki", "drama-detail")
          .replace(".html", "")
          .trim(),
        image: $(e).find("img").attr("src"),
        title: $(e).find("h3").text(),
        status: $(e).find(".meta > span").last().text(),
        year: $(e).find(".meta > span").first().text(),
        country: $(e).find(".meta > span").last().prev().text(),
      });
    });

    return data;
  };

  recent = async (): Promise<boolean | Drama[]> => {
    const v = await (
      await fetch(this.baseURL, {
        redirect: "follow",
        referrer: this.baseURL,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
        },
      })
    ).text();
    var data: Drama[] = [];
    const $ = cheerio.load(v);
    $(".list-episode-item > li").each((i: number, e: cheerio.Element) => {
      var _item: Drama = {
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
  };
  fetchPopular = async () => {
    try {
      const r = await (
        await fetch("https://asianwiki.co/most-watched.html")
      ).text();
      const $ = cheerio.load(r);

      var data: Drama[] = [];

      $(".content-l-item > .col-2 > li").each(
        (i: number, e: cheerio.Element) => {
          data.push({
            id: $(e)
              .find("a")
              .attr("href")
              ?.replace("asian-wiki", "drama-detail")
              .replace(".html", "")
              .trim(),
            image: $(e).find("img").attr("src"),
            title: $(e).find("h3").text(),
            status: $(e).find(".meta > span").last().text(),
            year: $(e).find(".meta > span").first().text(),
            country: $(e).find(".meta > span").last().prev().text(),
          });
        }
      );
      return data;
    } catch (e) {}
    return [];
  };

  fetchActor = async (id: string) => {
    var actor: Actor = { id: id };
    id = id.endsWith(".html") ? id : id + ".html";
    const v = await (await fetch("https://asianwiki.co/" + id)).text();
    const $ = cheerio.load(v);
    actor.name = $(".content-l-item")
      .find(".info-drama > h1")
      .text()
      .replace(RegExp(/\([0-9].*\)/), "");
    actor.otherNames = $(".content-l-item > .info-drama > .other_name > a")
      .map((i, e) => e.attribs["title"])
      .toArray<string>();
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
    $(".content-l-item > .col-2 > li").each((i: number, e: cheerio.Element) => {
      actor.movies!.push({
        id: $(e)
          .find("a")
          .attr("href")
          ?.replace("asian-wiki", "drama-detail")
          .replace(".html", "")
          .trim(),
        image: $(e).find("a > img").attr("src"),
        title: $(e).find("h3").text(),
        status: $(e).find(".meta > span").last().text(),
        year: $(e).find(".meta > span").first().text(),
        country: $(e).find(".meta > span").last().prev().text(),
      });
    });
    return actor;
  };
}
