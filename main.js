// ==UserScript==
// @name         ChatGPT-Prompt-Helper
// @namespace    https://github.com/TBXark/chatgpt-prompts-helper
// @author       TBXark
// @homepageURL  https://github.com/TBXark/chatgpt-prompts-helper
// @version      1.0.0
// @description  Show prompts for ChatGPT
// @match        https://chat.openai.com/*
// @match        https://bard.google.com/*
// @match        https://poe.com/*
// @connect      raw.githubusercontent.com
// @downloadURL  https://raw.githubusercontent.com/TBXark/chatgpt-prompt-helper/master/main.js
// @updateURL    https://raw.githubusercontent.com/TBXark/chatgpt-prompt-helper/master/main.js
// @grant        GM_addStyle
// ==/UserScript==

// 如果你用了其他第三方的网站可以在复制第五行，然后粘贴在下面继续添加自己的网站 @match https://chat.openai.com/*

(() => {
  // 这里可以替换成自己的模板,格式为 [{"act": "", "prompt": ""}]
  const templateURL =
    "https://raw.githubusercontent.com/TBXark/chatgpt-prompt-helper/master/templates/default.json";
  const button = document.createElement("div");
  button.classList.add("chatgpt-prompt-helper-button");
  button.textContent = "📋";
  document.body.appendChild(button);

  const list = document.createElement("div");
  list.classList.add("chatgpt-prompt-helper-list");
  document.body.appendChild(list);

  const createListItem = (title, content) => {
    const listItem = document.createElement("div");
    listItem.classList.add("chatgpt-prompt-helper-list-item");

    const itemTitle = document.createElement("div");
    itemTitle.classList.add("chatgpt-prompt-helper-list-item-title");
    itemTitle.textContent = title;
    listItem.appendChild(itemTitle);

    const itemContent = document.createElement("div");
    itemContent.classList.add("chatgpt-prompt-helper-list-item-content");
    itemContent.style.display = "none";
    itemContent.textContent = content;
    listItem.appendChild(itemContent);

    itemTitle.addEventListener("click", () => {
      itemContent.style.display = itemContent.style.display === "none" ? "block" : "none";
    });
    itemContent.addEventListener("click", () => {
      itemTitle.innerHTML = `${title} <strong>[copied!]<strong>`;
      setTimeout(() => {
        itemTitle.textContent = title;
      }, 2000);
      navigator.clipboard.writeText(content);
    });

    return listItem;
  };


  let listVisible = false;
  let isDragging = false;
  let dragStartX;
  let dragStartY;
  let buttonStartX;
  let buttonStartY;

  function updateListPosition() {
    list.style.top = `${button.offsetTop - list.offsetHeight}px`;
    list.style.left = `${
      button.offsetLeft + button.offsetWidth / 2 - list.offsetWidth
    }px`;
  }

  button.addEventListener("click", () => {
    listVisible = !listVisible;
    if (listVisible) {
      list.style.display = "block";
      updateListPosition();
    } else {
      list.style.display = "none";
    }
  });

  button.addEventListener("mousedown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    buttonStartX = button.offsetLeft;
    buttonStartY = button.offsetTop;
    updateListPosition();
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      const offsetX = event.clientX - dragStartX;
      const offsetY = event.clientY - dragStartY;
      const newButtonX = buttonStartX + offsetX;
      const newButtonY = buttonStartY + offsetY;
      button.style.left = `${newButtonX}px`;
      button.style.top = `${newButtonY}px`;
      updateListPosition();
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  fetch(templateURL).then((res) => {
    res.json().then((data) => {
      data.forEach((item) => {
        const listItem = createListItem(item.act, item.prompt);
        list.appendChild(listItem);
      });
    });
  });

  const style = `
    .chatgpt-prompt-helper-button {
        position: fixed;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        bottom: 80px;
        right: 80px;
        transform: translateY(-50%);
        cursor: move;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    .chatgpt-prompt-helper-list {
        position: fixed;
        width: 300px;
        height: 400px;
        overflow-y: scroll;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 9998;
        display: none;
        border-radius: 10px;
        padding: 10px;
    }
    
    .chatgpt-prompt-helper-list::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 6px;
        border: none;
    }

    .chatgpt-prompt-helper-list::-webkit-scrollbar {
        width: 6px;
    }

    .chatgpt-prompt-helper-list-item {
        border-bottom: 1px solid #eee;
        font-family: Arial, Helvetica, sans-serif;
        padding: 10px 0 10px 0;
    }

    .chatgpt-prompt-helper-list-item-title {
        cursor: pointer;
        font-size: 14px;
        color: #222;
    }

    .chatgpt-prompt-helper-list-item-content {
        padding-top: 10px;
        font-size: 12px;
        cursor: pointer;
        color: #666;
    }
  `;

  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(style);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(style);
  } else if (typeof addStyle != "undefined") {
    addStyle(style);
  } else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(style));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      document.documentElement.appendChild(node);
    }
  }
})();
