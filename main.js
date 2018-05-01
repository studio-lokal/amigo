const ipcMain = require('electron').ipcMain;
const menubar = require('menubar');

const apis = require('./lib/apis')
const config = require('./config')

const mb = menubar({
  width: config.width,
  height: config.height,
  dir: config.dir
});

mb.on('ready', function ready() {
  // main process
})

ipcMain.on('search', (e, text) => {
  apis.detect(text)
    .then(res => {
      return apis.translate({ source: res.body.langCode, text })
    })
    .then(res => {
      const translatedText = res.body.message.result.translatedText
      e.sender.send('async-search', true, translatedText)
    })
    .catch(err => {
      console.error(err)
      e.sender.send('async-search', false, err)
    })
})

ipcMain.on('hide', () => {
  mb.app.hide()
})
