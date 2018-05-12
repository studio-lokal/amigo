const superagent = require('superagent');
const config = require('../config');
require('dotenv').config();

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

function detect(query) {
  // response example : { "langCode" : "ko" }
  return superagent
    .post(config.naverApi.detect)
    .type('form')
    .set('X-Naver-Client-Id', NAVER_CLIENT_ID)
    .set('X-Naver-Client-Secret', NAVER_CLIENT_SECRET)
    .send({
      query
    })
};

// destructuring assignment
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
function translate({ source, target, text } = {}) {
  console.log("I'm in function, translate !");
  console.log(source, target, text)
  return superagent
    .post(config.naverApi.translate)
    .type('form')
    .set('X-Naver-Client-Id', NAVER_CLIENT_ID)
    .set('X-Naver-Client-Secret', NAVER_CLIENT_SECRET)
    .send({
      source,
      target,
      text
    })
};

function setTranslateQuery({ source, target, text } = {}) {
  console.log("I'm in function, setTranslateQuery !");
  // set target if 'target' is undefined.
  if (source === 'ko') target = target || 'en';
  else target = target || 'ko';

  // adjust source name of Chinese for query.
  if (source === 'zh-cn') source = 'zh-CN';
  else if (source === 'zh-tw') source = 'zh-TW';
  // adjust target name of Chinese for query.
  if (target === 'zh-cn') target = 'zh-CN';
  else if (target === 'zh-tw') target = 'zh-TW';
  console.log(source, target, text)

  // there are 15 langCode, including 'unknown'.
  const lang = {'ko':'한국어', 'ja':'일본어', 'zh-CN': '중국어 간체', 'zh-TW': '중국어 번체',
    'hi':'힌디어', 'en':'영어', 'es':'스페인어', 'fr':'프랑스어', 'de':'독일어', 'pt':'포르투갈어', 
    'vi':'베트남어', 'id':'인도네시아어', 'th':'태국어', 'ru':'러시아어', 'unk': '알수없음'};
  const supported = {
    'ko' : ['en', 'zh-CN', 'zh-TW', 'es', 'fr', 'vi', 'th', 'id'],
    'en' : ['ko', 'ja', 'fr'], 
    'fr': ['ko', 'en'],
    'zh-CN': ['ko'], 
    'zh-TW': ['ko'],
    'es': ['ko'], 
    'vi': ['ko'], 
    'th': ['ko'], 
    'id': ['ko'], 
    'ja': ['es'], 
  };
  //console.log("is source supported? ", Object.keys(supported).includes(source));
  if (!(Object.keys(supported).includes(source) && supported[source].includes(target))) {
    // for a shift
    console.log("not yet supported set.");
    let say_sth = lang[source]+'에서 '+lang[target]+'으로의 변환은 아직 지원되지 않습니다.';
    [source, target, text] = ['ko', 'en', say_sth];
  } 
  
  return {source: source, target: target, text: text};
}

module.exports = {
  detect,
  translate,
  setTranslateQuery
}
