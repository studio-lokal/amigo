const { ipcRenderer } = require("electron");
const { remote } = require("electron");

const button = window.document.getElementById("btn-search");
button.onclick = function() {
  const text = window.document.getElementById("text").value.trim();
  const target = "";

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
