const ipcMain = require("electron").ipcMain;
const menubar = require("menubar");

const apis = require("./lib/apis");
const config = require("./config");

// there are 15 langCodes, including 'unknown'.
const langInfo = config.languageSet.langInfo;
const langCodes = config.languageSet.langCodes;

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
      let source = res.body.langCode;
      if (source === "unk") throw "어느 나라 말인가요??";
      let query = setTranslateQuery({ source: source, text });
      if (!isSupported(query)) {
        throw `아직 ${langCodes[query.source].name}에서 ${
          langCodes[query.target].name
        }로 번역할 줄은 모르겠어요.`;
      } else {
        return apis.translate(query);
      }
    })
    .then(res => {
      const translatedText = res.body.message.result.translatedText;
      e.sender.send("async-search", true, translatedText);
    })
    .catch(err => {
      e.sender.send("async-search", false, err);
    });
});

ipcMain.on("hide", () => {
  mb.app.hide();
});

function isSupported({ source, target, text } = {}) {
  if (
    !(
      langInfo.translationKeys.includes(source) &&
      langCodes[source].supportedTargets.includes(target)
    )
  ) {
    return false;
  } else {
    return true;
  }
}

function setTranslateQuery({ source, target, text } = {}) {
  // set target if 'target' is undefined.
  if (source === "ko") target = target || "en";
  else target = target || "ko";

  // adjust source name of Chinese for query.
  if (source === "zh-cn") source = "zh-CN";
  else if (source === "zh-tw") source = "zh-TW";
  // adjust target name of Chinese for query.
  if (target === "zh-cn") target = "zh-CN";
  else if (target === "zh-tw") target = "zh-TW";

  return { source, target, text };
}
