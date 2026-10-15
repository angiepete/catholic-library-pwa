// Catholic Library — on-demand loading
let libraryIndex = null;
let currentCategory = "all";
let bookmarks = JSON.parse(localStorage.getItem("catholicBookmarks") || "[]");
const contentCache = {};

async function loadIndex() {
  if (libraryIndex) return libraryIndex;
  const res = await fetch("./index.json");
  libraryIndex = await res.json();
  return libraryIndex;
}

async function loadText(id) {
  if (contentCache[id]) return contentCache[id];
  const res = await fetch(`./texts/${id}.json`);
  const data = await res.json();
  contentCache[id] = data.content;
  return data.content;
}

async function renderList(filter = "") {
  const index = await loadIndex();
  const container = document.getElementById("content");
  let items = [];
  if (currentCategory === "all") {
    Object.values(index).forEach(cat => items.push(...cat));
  } else {
    items = index[currentCategory] || [];
  }
  if (filter) {
    const q = filter.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q));
  }
  if (items.length === 0) {
    container.innerHTML = "<p style='color:#a0a0b0'>No results.</p>";
    return;
  }
  container.innerHTML = `<div class="book-list">${items.map(item => `
    <div class="book-item" onclick="openReader('${item.id}')">
      <h3>${item.title}</h3>
      <p>${item.category}</p>
    </div>`).join("")}</div>`;
}

async function openReader(id) {
  const index = await loadIndex();
  let meta = null;
  for (const cat of Object.values(index)) {
    meta = cat.find(i => i.id === id);
    if (meta) break;
  }
  if (!meta) return;
  const content = await loadText(id);
  const isBookmarked = bookmarks.includes(id);
  document.getElementById("content").innerHTML = `
    <div class="reader">
      <h2>${meta.title}</h2>
      <div class="content">${content}</div>
      <button class="bookmark-btn" onclick="toggleBookmark('${id}')">
        ${isBookmarked ? "★ Remove Bookmark" : "☆ Add Bookmark"}
      </button>
    </div>`;
}

function toggleBookmark(id) {
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(b => b !== id);
  } else {
    bookmarks.push(id);
  }
  localStorage.setItem("catholicBookmarks", JSON.stringify(bookmarks));
  openReader(id);
}

function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`[data-cat="${cat}"]`).classList.add("active");
  renderList(document.getElementById("search").value);
}

document.addEventListener("DOMContentLoaded", () => {
  renderList();
  document.getElementById("search").addEventListener("input", e => renderList(e.target.value));
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}