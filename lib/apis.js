const superagent = require("superagent");
const config = require("../config");
require("dotenv").config();

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

function detect(query) {
  // response example : { "langCode" : "ko" }
  return superagent
    .post(config.naverApi.detect)
    .type("form")
    .set("X-Naver-Client-Id", NAVER_CLIENT_ID)
    .set("X-Naver-Client-Secret", NAVER_CLIENT_SECRET)
    .send({
      query
    });
}

// destructuring assignment
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
function translate({ source, target, text } = {}) {
  return superagent
    .post(config.naverApi.translate)
    .type("form")
    .set("X-Naver-Client-Id", NAVER_CLIENT_ID)
    .set("X-Naver-Client-Secret", NAVER_CLIENT_SECRET)
    .send({
      source,
      target,
      text
    });
}

module.exports = {
  detect,
  translate
};
