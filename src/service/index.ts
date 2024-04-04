import CryptoJS from "crypto-js";

const key: CryptoJS.lib.WordArray = CryptoJS.enc.Utf8.parse(
  "93422192433952489752342908585752"
);
const iv: CryptoJS.lib.WordArray = CryptoJS.enc.Utf8.parse("9262859232435825");

const GenerateParams = async (
  msg: string
): Promise<{ params: string; downloadId: string }> => {
  const data2: string = CryptoJS.enc.Utf8.stringify(
    CryptoJS.AES.decrypt(msg, key, { iv })
  );
  const data3: string = data2.substring(0, data2.indexOf("&"));
  return {
    params: `id=${encodeURIComponent(
      CryptoJS.AES.encrypt(data3, key, { iv }).toString()
    )}${data2.substring(data2.indexOf("&"))}&alias=${encodeURIComponent(
      data3
    )}`,
    downloadId: data2,
  };
};

const GetM3U8 = async (hash: string): Promise<any> => {
  const requestData: { params: string; downloadId: string } =
    await GenerateParams(hash);
  const response: Response = await fetch(
    `https://pladrac.net/encrypt-ajax.php?${requestData.params}`
  );
  const responseData: any = await response.json();
  const decryptedData: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(
    responseData.data,
    key,
    { iv }
  );
  var data = JSON.parse(CryptoJS.enc.Utf8.stringify(decryptedData));
  data["download"] =
    "https://pladrac.net/download?id=" + requestData.downloadId;
  return data;
};

const AsianLoad = async (id: string): Promise<void> => {
  var resp: string = await (
    await fetch("https://dramacool.com.pa/" + id + ".html")
  ).text();
  var presp = await (
    await fetch("https:" + resp.match(/src="([^"]*pladrac[^"]*)"/)![1])
  ).text();

  const matchDataValue = presp.match(/data-value="(.*)"/)![1];
  if (presp && matchDataValue) {
    return await GetM3U8(matchDataValue);
  } else {
    console.error("Error: Matching patterns not found.");
  }
};

export default AsianLoad;
