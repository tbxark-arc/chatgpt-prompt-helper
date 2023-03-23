// ==UserScript==
// @name         ChatGPT-Prompt-Helper
// @namespace    https://github.com/TBXark/chatgpt-prompts-helper
// @author       TBXark
// @homepageURL  https://github.com/TBXark/chatgpt-prompts-helper
// @version      1.1.0
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
    "https://raw.githubusercontent.com/TBXark/chatgpt-prompt-helper/master/templates/favorite.json";

  const button = document.createElement("div");
  button.classList.add("chatgpt-prompt-helper-button");
  button.textContent = "📋";
  document.body.appendChild(button);

  // 横行segment筛选器
  const segmentFilter = document.createElement("div");
  segmentFilter.classList.add("chatgpt-prompt-helper-segment-filter");
  const segmentData = [
    "favorite",
    "language",
    "code",
    "write",
    "article",
    "ai",
    "comments",
    "text",
    "seo",
    "life",
    "interesting",
    "living",
    "speech",
    "mind",
    "social",
    "philosophy",
    "teacher",
    "interpreter",
    "games",
    "tool",
    "company",
    "doctor",
    "finance",
    "music",
    "professional",
    "contribute",
    "personal",
  ];
  for (let i = 0; i < segmentData.length; i++) {
    const segmentItem = document.createElement("div");
    segmentItem.classList.add("chatgpt-prompt-helper-segment-filter-item");
    segmentItem.textContent = segmentData[i];
    segmentFilter.appendChild(segmentItem);
    segmentItem.addEventListener("click", () => {
      loadTemplates(
        `https://raw.githubusercontent.com/TBXark/chatgpt-prompt-helper/master/templates/${segmentData[i]}.json`
      );
      const segmentItems = document.getElementsByClassName(
        "chatgpt-prompt-helper-segment-filter-item"
      );
      for (let j = 0; j < segmentItems.length; j++) {
        segmentItems[j].classList.remove(
          "chatgpt-prompt-helper-segment-filter-item-active"
        );
      }
      segmentItem.classList.add(
        "chatgpt-prompt-helper-segment-filter-item-active"
      );
    });
    if (i == 0) {
      segmentItem.classList.add(
        "chatgpt-prompt-helper-segment-filter-item-active"
      );
    }
  }

  const list = document.createElement("div");
  list.classList.add("chatgpt-prompt-helper-list");
  document.body.appendChild(list);

  const createListItem = (title, subtitle, content) => {
    const listItem = document.createElement("div");
    listItem.classList.add("chatgpt-prompt-helper-list-item");

    const itemTitle = document.createElement("div");
    itemTitle.classList.add("chatgpt-prompt-helper-list-item-title");
    itemTitle.textContent = title;
    listItem.appendChild(itemTitle);

    if (subtitle) {
      const itemSubtitle = document.createElement("div");
      itemSubtitle.classList.add("chatgpt-prompt-helper-list-item-subtitle");
      itemSubtitle.textContent = subtitle;
      listItem.appendChild(itemSubtitle);
    }

    const itemContent = document.createElement("div");
    itemContent.classList.add("chatgpt-prompt-helper-list-item-content");
    itemContent.style.display = "none";
    itemContent.textContent = content;
    listItem.appendChild(itemContent);

    itemTitle.addEventListener("click", () => {
      itemContent.style.display =
        itemContent.style.display === "none" ? "block" : "none";
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
  let isMoving = false;
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
    if (isMoving) {
      return;
    }
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
    isMoving = false;
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
      isMoving = offsetX > 5 || offsetY > 5;
      updateListPosition();
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
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

    .chatgpt-prompt-helper-segment-filter {
        width: 100%;
        height: 40px;
        overflow-x: scroll;
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 9999;        
    }

    .chatgpt-prompt-helper-segment-filter::-webkit-scrollbar {
      display: none;
    }

    .chatgpt-prompt-helper-segment-filter-item {
        padding: 5px 10px;
        cursor: pointer;
        background-color: #FFF3F3;
        color: #444;
        border-radius: 15px;
        margin: 0 5px;
        font-family: Arial, Helvetica, sans-serif;
    }

    .chatgpt-prompt-helper-segment-filter-item-active {
        background-color: #FFB6B6;
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
        font-size: 16px;
        color: #222;
    }

    .chatgpt-prompt-helper-list-item-subtitle {
      cursor: pointer;
      font-size: 10px;
      color: #666;
  }


    .chatgpt-prompt-helper-list-item-content {
        padding-top: 10px;
        cursor: pointer;
        font-size: 14px;
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

  function loadTemplates(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        while (list.firstChild) {
          list.removeChild(list.firstChild);
        }
        list.appendChild(segmentFilter);
        data.forEach((item) => {
          const listItem = createListItem(item.act, item.sub, item.prompt);
          list.appendChild(listItem);
        });
      });
  }

  loadTemplates(templateURL);
})();
