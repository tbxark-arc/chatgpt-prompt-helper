// ==UserScript==
// @name         ChatGPT-Prompt-Helper
// @namespace    https://github.com/TBXark/chatgpt-prompts-helper
// @version      1.0.0
// @description  Show prompts for ChatGPT
// @match        https://chat.openai.com/*
// ==/UserScript==

// 如果你用了其他第三方的网站可以在复制第五行，然后粘贴在下面继续添加自己的网站 @match        https://chat.openai.com/*

(() => {
  // 这里可以替换成自己的模板,格式为 [{"act": "", "prompt": ""}]
  const templateURL =
    "https://raw.githubusercontent.com/TBXark/chatgpt-prompt-helper/master/templates/default.json";
  const button = document.createElement("div");
  button.style.position = "fixed";
  button.style.width = "40px";
  button.style.height = "40px";
  button.style.borderRadius = "20px";
  button.style.backgroundColor = "#fff";
  button.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  button.style.zIndex = "9999";
  button.style.bottom = "80px";
  button.style.right = "80px";
  button.style.transform = "translateY(-50%)";
  button.style.cursor = "move";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.textContent = "📋";

  const list = document.createElement("div");
  list.style.position = "fixed";
  list.style.width = "300px";
  list.style.height = "400px";
  list.style.overflowY = "auto";
  list.style.backgroundColor = "#fff";
  list.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  list.style.zIndex = "9998";
  list.style.display = "none";
  list.style.borderRadius = "10px";
  list.style.padding = "10px";
  list.style.overflowY = "scroll";

  document.body.appendChild(list);
  document.body.appendChild(button);

  const createListItem = (title, content) => {
    const listItem = document.createElement("div");
    listItem.style.borderBottom = "1px solid #ccc";
    listItem.style.fontFamily = "Arial, Helvetica, sans-serif";
    listItem.style.padding = "10px 0 10px 0";

    const itemTitle = document.createElement("div");
    itemTitle.style.fontWeight = "520";
    itemTitle.style.cursor = "pointer";
    itemTitle.style.fontSize = "14px";
    itemTitle.style.color = "#666"
    itemTitle.textContent = title;
    listItem.appendChild(itemTitle);

    const itemContent = document.createElement("div");
    itemContent.style.display = "none";
    itemContent.style.paddingTop = "10px";
    itemContent.style.fontSize = "12px";
    itemContent.style.cursor = "pointer";
    itemContent.style.color = "#333"
    itemContent.textContent = content;
    listItem.appendChild(itemContent);

    itemTitle.addEventListener("click", () => {
      itemContent.style.display =
        itemContent.style.display == "none" ? "block" : "none";
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

  // Event

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
    } else {
      list.style.display = "none";
    }
    updateListPosition();
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
})();
