const { ipcRenderer } = require("electron");
const { remote } = require("electron");
const config = require("../config");

const langInfo = config.languageSet.langInfo;
const langCodes = config.languageSet.langCodes;

let target = "";
const button = window.document.getElementById("btn-search");
button.onclick = function() {
  const text = window.document.getElementById("text").value.trim();
  console.log('target:: ' + target);
  ipcRenderer.send("search", { text, target });
  ipcRenderer.once("async-search", (e, success, result) => {
    if (success) {
      window.document.getElementById("translated-text").value = result;
    } else {
      // should subdivide error handling.
      window.document.getElementById("translated-text").value = result;
    }
    setTextFontSize(result, "translated-text");
  });
};

const searchPress = function(e) {
  e = e || window.event;
  if (e.keyCode == 13) {
    e.preventDefault();
    document.getElementById("btn-search").click();
    setSourceText(removeLineBreak(getSourceText()));
    return false;
  }
  return true;
};
const search = window.document.getElementById("text");
search.onkeyup = function(event) {
  const text = window.document.getElementById("text").value;
  setTextFontSize(text, "text");
  return searchPress(event);
};

window.document.getElementById("copy").onclick = copy;

// dropdown action
const dropdownMenu = window.document.querySelector('.dropdown-menu');
// 1. button click,
const dropdownButton = window.document.querySelector('.dropdown button');
dropdownButton.onclick = function() {
  if(this.parentNode.classList.contains('open')) {
    this.parentNode.classList.remove('open');
  } else {
    this.parentNode.classList.add('open');
  }
}

// langInfo.translationKeys.forEach(lang => {
//   if(lang !== 'unk') {
//     const dropdownItem = document.createElement('li');
//     dropdownItem.classList.add('dropdown-item');
//     dropdownItem.setAttribute('value', lang);
//     console.log(lang)
//     dropdownMenu.appendChild(dropdownItem);
//   }
// });
Object.keys(langCodes).forEach(key => {
  const dropdownItem = document.createElement('li');
  dropdownItem.classList.add('dropdown-item');
  dropdownItem.setAttribute('value', key);
  dropdownItem.textContent = langCodes[key].name;
  dropdownMenu.appendChild(dropdownItem);
  console.log(key, langCodes[key]);
});

// 2. list item click
const dropdownItems = window.document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
  item.addEventListener('click', changingLanguage);
})
function changingLanguage () {
  switch (this.getAttribute('value')) {
    case 'ko':
      dropdownButton.textContent = 'Korean';
      break;
    case 'en':
      dropdownButton.textContent = 'English';
      target = 'en';
      break;
    case 'fr':
      dropdownButton.textContent = 'French';
      target = 'fr';
      break;
    default:
      break;
  }
}
// dropdownItem.onclick = function() {
//   console.log(this.getAttribute('value'));
// }

function copy() {
  /* Get the text field */
  var copyText = document.getElementById("translated-text");

  if (copyText.value) {
    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    toast();
  }
}

function toast() {
  const toastEle = document.getElementById("toaster");

  // Add the "show" class to DIV
  toastEle.className = "active";

  // After 3 seconds, remove the active class
  setTimeout(function() {
    toastEle.className = toastEle.className.replace("active", "");
  }, 3000);
}

const closeBtn = document.getElementById("close-window");
closeBtn.onclick = function() {
  ipcRenderer.send("hide");
};

function getSourceText() {
  return window.document.getElementById("text").value;
}

function setSourceText(text) {
  window.document.getElementById("text").value = text;
  return text;
}

function setTextFontSize(text, elementId) {
  if (text.length > 60) {
    window.document.getElementById(elementId).style.fontSize = "16px";
  } else if (text.length > 45) {
    window.document.getElementById(elementId).style.fontSize = "22px";
  } else if (text.length > 30) {
    window.document.getElementById(elementId).style.fontSize = "27px";
  } else if (text.length > 15) {
    window.document.getElementById(elementId).style.fontSize = "32px";
  } else {
    window.document.getElementById(elementId).style.fontSize = "40px";
  }
  return text.length;
}

function removeLineBreak(str) {
  return str.replace(/(\r\n|\n|\r)/gm, "");
}
