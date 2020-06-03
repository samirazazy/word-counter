const el = { t: "#textArea", result: "#counter" };

function leave(e) {
  document.body.classList.remove("over");
}

function over(e) {
  e.preventDefault();
  document.body.classList.add("over");
}

async function drop(e) {
  e.preventDefault();

  const droppedType = e.dataTransfer.types[0];
  const handlerFunc = handlers[droppedType];
  if (handlerFunc) {
    await handlerFunc(e.dataTransfer);
  }
}

function updateWordCount(e) {
  const words = el.t.value.trim().match(/\S+/g);
  el.result.textContent = words ? words.length : 0;
}

/* global FileReader */
function loadFile(file) {
  const fr = new FileReader();
  return new Promise((resolve, reject) => {
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsText(file);
  });
}

const handlers = {
  Files: handleFileDrag,
  "text/plain": handleTextDrag,
};

async function handleFileDrag(dataTransfer) {
  const f = dataTransfer.items[0].getAsFile();
  el.t.value = await loadFile(f);
  updateWordCount();
}

function handleTextDrag(dataTransfer) {
  el.t.value = dataTransfer.getData("text/plain");
  updateWordCount();
}

function setupEl() {
  for (const key of Object.keys(el)) {
    el[key] = document.querySelector(el[key]);
  }
}

function init() {
  setupEl();

  el.t.addEventListener("input", updateWordCount);
  document.body.addEventListener("dragover", over);
  document.body.addEventListener("drop", drop);
  document.body.addEventListener("drop", leave);
  document.body.addEventListener("dragleave", leave);
}

window.addEventListener("load", init);
