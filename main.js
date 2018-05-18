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
  dir: config.dir,
  minWidth: config.minWidth
});

mb.on("ready", function ready() {
  // main process
});

ipcMain.on("search", (e, { text, target }) => {
  apis
    .detect(text) // response example : { "langCode" : "ko" }
    .then(res => checkRequestCode({ source: res.body.langCode, target }))
    .then(res => requestTranslate({ source: res.source, target: res.target, text}))
    .then(result => sendTranslatedText(e, result))
    .catch(err => errorHandling(e, err));
});

ipcMain.on("hide", () => {
  mb.app.hide();
});

function checkRequestCode({ source, target } = {}) {
  if (source === "unk") {
    let error = new Error("어느 나라 말인가요?");
    error.name = "DetactError";
    throw error;
  }
  return isSupported(setCodeForTranslate({ source, target }));
}

function setCodeForTranslate({ source, target } = {}) {
  // set target if 'target' is undefined.
  if (source === "ko") target = target || "en";
  else target = target || "ko";
  // adjust source name of Chinese for query.
  if (source === "zh-cn") source = "zh-CN";
  else if (source === "zh-tw") source = "zh-TW";
  // adjust target name of Chinese for query.
  if (target === "zh-cn") target = "zh-CN";
  else if (target === "zh-tw") target = "zh-TW";

  return { source, target };
}

function isSupported({ source, target } = {}) {
  if (
    !(
      langInfo.translationKeys.includes(source) &&
      langCodes[source].supportedTargets.includes(target)
    )
  ) {
    let error = new Error(
      `아직 ${langCodes[source].name}에서 ${langCodes[target].name}로 번역할 줄은 몰라요.`
    );
    error.name = "TranslateError";
    throw error;
  } else {
    return { source, target };
  }
}

function requestTranslate({ source, target, text } = {}) {
  console.log(source, target, text);
  return new Promise((resolve, reject) => {
    apis
      .translate({ source, target, text })
      .then(res =>
        resolve({
          translatedText: res.body.message.result.translatedText,
          source,
          target,
          text
        })
      )
      .catch(err => reject(err));
  });
}

function sendTranslatedText(e, result) {
  // we may send a result Object including translatedText, source, target, text etc.
  console.log(result);
  e.sender.send("async-search", true, result.translatedText);
}

function errorHandling(e, err) {
  console.log(err);
  let message = "에러가 났네요. 다시 한 번 시도해주세요 :D";
  if (err.name === "DetactError" || err.name === "TranslateError") {
    message = err.message;
  } else {
    let errorCode = err.response.body.errorCode;
    if (errorCode.startsWith('LD')) {
      message = "언어감지 오류";
      if (errorCode === "LD01") message += ": 문장을 넣어주세요.";
      else message += ": 다시 한 번 시도해주세요.";
    } else if (errorCode.startsWith('N2MT')) {
      message = "번역 오류";
      if (errorCode == "N2MT08") message += ": 문장이 너무 길어요!"; // up to 5000 characters.
      else message += ": 다시 한 번 시도해주세요.";
    }
  }
  console.log(message);
  e.sender.send("async-search", false, message);
}
