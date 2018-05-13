const ipcMain = require("electron").ipcMain;
const menubar = require("menubar");

const apis = require("./lib/apis");
const config = require("./config");

const mb = menubar({
  width: config.width,
  height: config.height,
  dir: config.dir
});

mb.on("ready", function ready() {
  // main process
});

ipcMain.on("search", (e, text) => {
  apis
    .detect(text)
    .then(res => {
      // response example : { "langCode" : "ko" }
      let query = setTranslateQuery({ source: res.body.langCode, text });
      return apis.translate(query);
    })
    .then(res => {
      const translatedText = res.body.message.result.translatedText;
      e.sender.send("async-search", true, translatedText);
    })
    .catch(err => {
      console.error(err);
      e.sender.send("async-search", false, err);
    });
});

ipcMain.on("hide", () => {
  mb.app.hide();
});

function setTranslateQuery({ source, target, text } = {}) {
  console.log("I'm in function, setTranslateQuery !");
  // set target if 'target' is undefined.
  if (source === "ko") target = target || "en";
  else target = target || "ko";

  // adjust source name of Chinese for query.
  if (source === "zh-cn") source = "zh-CN";
  else if (source === "zh-tw") source = "zh-TW";
  // adjust target name of Chinese for query.
  if (target === "zh-cn") target = "zh-CN";
  else if (target === "zh-tw") target = "zh-TW";
  console.log(source, target, text);

  // there are 15 langCodes, including 'unknown'.
  const langInfo = config.languageSet.langInfo;
  const langCodes = config.languageSet.langCodes;
  if (
    !(
      langInfo.translationKeys.includes(source) &&
      langCodes[source].supportedTargets.includes(target)
    )
  ) {
    // for a shift
    console.log("not yet supported set.");
    let say_sth = `${langCodes[source].name}에서 ${
      langCodes[target].name
    }으로의 변환은 아직 지원되지 않습니다.`;
    [source, target, text] = ["ko", "en", say_sth];
  }

  return { source: source, target: target, text: text };
}
