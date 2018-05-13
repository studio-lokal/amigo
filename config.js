const path = require("path");

module.exports = {
  width: 300,
  height: 400,
  dir: path.join(__dirname, "views"),
  naverApi: {
    detect: "https://openapi.naver.com/v1/papago/detectLangs",
    translate: "https://openapi.naver.com/v1/papago/n2mt"
  },
  minWidth: 300
};
