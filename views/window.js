const {ipcRenderer} = require('electron');
const {remote} = require('electron');

const button = window.document.getElementById('btn-search');
button.onclick = function () {
    const text = window.document.getElementById('text').value

    ipcRenderer.send('search', text)
    ipcRenderer.once('async-search', (e, success, result) => {
      if (success) {
        window.document.getElementById('translated-text').value = result
      } else {
        // TODO: 에러 처리
      }
    })
};

const searchPress = function (e) {
  e = e || window.event;
  if (e.keyCode == 13) {
    document.getElementById('btn-search').click();
    return false;
  }
  return true;
}
const search = window.document.getElementById('text');
search.onkeypress = function (event) {
  return searchPress(event);
}

window.document.getElementById('copy').onclick = copy

function copy () {
  /* Get the text field */
  var copyText = document.getElementById('translated-text');

  if (copyText.value) {
    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");

    toast();
  }
} 

function toast () {
  const toastEle = document.getElementById('toaster');

  console.log(toastEle.classList);

  // Add the "show" class to DIV
  toastEle.className= 'active';

  // After 3 seconds, remove the active class
  setTimeout(function(){ toastEle.className = toastEle.className.replace("active", ""); }, 3000);
}

const closeBtn = document.getElementById('close-window');
closeBtn.onclick = function() {
  ipcRenderer.send('hide');
}