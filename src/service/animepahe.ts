import * as cheerio from "cheerio";
import { Episode } from "../model/Anime";

export default class AnimepaheFetcher {
  protected baseurl = "https://animepahe.ru";
  protected header = {
    Referer: "https://animepahe.ru/",
    Cookie: "__ddg2_=; __ddg1_=;",
  };
  fetchRecent = async (): Promise<any> => {
    var r = await fetch(this.baseurl + "/api?m=airing", {
      headers: this.header,
    }).then((v) => v.json());
    return r;
  };
  search = async (q: string): Promise<any> => {
    var r = await fetch(this.baseurl + `/api?m=search&q=${q}`, {
      headers: this.header,
    }).then((v) => v.json());
    return r;
  };
  fetchInfo = async (id: string): Promise<any> => {
    var data = await fetch(this.baseurl + `/anime/${id}`, {
      headers: this.header,
    }).then((v) => v.text());

    const $ = cheerio.load(data);

    var info: any = {};
    info.title = $(".title-wrapper").find("h1 > span").text();
    info.image = $(".anime-poster").find("a").attr("href");
    info.desc = $(".anime-content > div > .anime-summary")
      .text()
      .replace("\n", "")
      .trim();
    info.romaji = $('.anime-info p:contains("Japanese:")')
      .text()
      .split(":")
      .pop();
    info.episodes = $('.anime-info p:contains("Episodes:")')
      .text()
      .split(":")
      .pop();
    info.status = $('.anime-info p:contains("Status:")')
      .text()
      .split(":")
      .pop()
      ?.replace("\n", "")
      .trim();
    info.aniId = $('.anime-info a:contains("AniList")')
      .attr("href")
      ?.split("/")
      .pop();
    info.tags = $(".anime-info .anime-genre ul li")
      .map((_, e) => $(e).text().trim())
      .get();
    info.recommendation = $(".anime-recommendation > div > .row")
      .map((_, e) => ({
        id: $(e).children().first().find("a").attr("href")?.split("/").pop(),
        title: $(e).children().first().find("a").attr("title"),
        image: $(e).children().first().find("a > img").attr("data-src"),
        type: $(e).children().last().find("strong").text(),
        episodes: $(e)
          .children()
          .last()
          .text()
          .match(/-\s(.*?)Episodes/)?.[1]
          .trim(),
        status: $(e)
          .children()
          .last()
          .text()
          .match(/\((.*?)\)/)?.[1]
          .trim(),
        year: $(e).children().last().children().last().text(),
      }))
      .get();
    info.relations = $(".anime-relation")
      .children()
      .find(".row.mx-n1")
      .map((_, e) => ({
        id: $(e).children().first().find("a").attr("href")?.split("/").pop(),
        title: $(e).children().first().find("a").attr("title"),
        image: $(e).children().first().find("a > img").attr("data-src"),
        type: $(e).children().last().find("strong").text(),
        episodes: $(e)
          .children()
          .last()
          .text()
          .match(/-\s(.*?)Episodes/)?.[1]
          .trim(),
        status: $(e)
          .children()
          .last()
          .text()
          .match(/\((.*?)\)/)?.[1]
          .trim(),
        year: $(e).children().last().children().last().text(),
      }))
      .get();
    info.episodes = await this.fetchEpisodes(id);

    return info;
  };
  fetchEpisodes = async (id: string, page?: string): Promise<any> => {
    try {
      var r = (
        await fetch(
          this.baseurl +
            `/api?m=release&id=${id}&sort=episode_desc&page=${page}`,
          {
            headers: this.header,
          }
        ).then((v) => v.json())
      ).data;
      var episodes: Episode[] = [];
      r.forEach((e: any) => {
        episodes.push({
          id: `/play/${id}/${e["session"]}`,
          episode: e["episode"],
          duration: e["duration"],
          anime_id: e["anime_id"],
          created_at: e["created_at"],
          title: e["title"],
          disc: e["disc"],
          image: e["snapshot"],
          type: e["audio"],
        });
      });
      return episodes;
    } catch (e) {
      return { msg: "No Episodes found!" };
    }
  };
  fetchm3u8 = async (id: string): Promise<any> => {
    const resp = await fetch(this.baseurl + id, {
      headers: this.header,
    }).then((v) => v.text());

    var url = resp.match(/let url = "(.*)"/)?.[1];
    console.log(url);

    var r = await fetch(url!, {
      headers: {
        Referer: this.baseurl,
      },
    }).then((v) => v.text());

    const link = eval(
      /(eval)(\(function[\s\S]*?)(<\/script>)/s.exec(r)![2].replace("eval", "")
    ).match(/https.*?m3u8/)[0];
    return { url: link, thumbnail: resp.match(/https?:\/\/[^\s]*\.jpg/)?.[0] };
  };
}
