export default class Yonaplay {
  static extractYona = async (
    id: string,
    key: string
  ): Promise<string | any> => {
    console.log("3");
    try {
      var sorplay = (
        await (
          await fetch(atob(id) + "&apiKey=" + key, {
            headers: {
              Referer: "https://witanime.one/",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            },
          })
        ).text()
      ).match(/go_to_player.*(https.*?)'/)![1];
      console.log(sorplay);
      var r = await (
        await fetch(sorplay, {
          headers: {
            Referer: "https://witanime.one/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          },
        })
      ).text();
      return r.match(/file.*(https.*?)","/)![1];
    } catch (error) {
      return error;
    }
  };
  static extractAsnwish = async (id: string): Promise<string | any> => {
    try {
      const r = await (
        await fetch("https://asnwish.com/e/" + id, {
          headers: {
            Referer: "https://witanime.one/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          },
        })
      ).text();
      return r.match(/file.*(https.*?)"/)![1];
    } catch (error) {
      return error;
    }
  };
}
