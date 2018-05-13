const path = require("path");
const languageSet = require("./languageSet.json");

module.exports = {
  width: 300,
  height: 400,
  dir: path.join(__dirname, "views"),
  naverApi: {
    detect: "https://openapi.naver.com/v1/papago/detectLangs",
    translate: "https://openapi.naver.com/v1/papago/n2mt"
  },
  minWidth: 300,
  languageSet: languageSet
};
