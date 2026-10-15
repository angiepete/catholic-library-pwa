// Sample public-domain content (expandable)
const library = {
  bible: [
    {
      id: "dr-gen1",
      title: "Genesis 1 (Douay-Rheims)",
      category: "Bible",
      content: `In the beginning God created heaven, and earth. And the earth was void and empty, and darkness was upon the face of the deep; and the spirit of God moved over the waters. And God said: Be light made. And light was made. And God saw the light that it was good; and he divided the light from the darkness. And he called the light Day, and the darkness Night; and there was evening and morning one day.

And God said: Let there be a firmament made amidst the waters: and let it divide the waters from the waters. And God made a firmament, and divided the waters that were under the firmament, from those that were above the firmament, and it was so. And God called the firmament, Heaven; and the evening and morning were the second day.

And God said: Let the waters that are under the heaven, be gathered together into one place: and let the dry land appear. And it was so done. And God called the dry land, Earth; and the gathering together of the waters, he called Seas. And God saw that it was good.`
    },
    {
      id: "dr-john1",
      title: "John 1 (Douay-Rheims)",
      category: "Bible",
      content: `In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God. All things were made by him: and without him was made nothing that was made. In him was life, and the life was the light of men. And the light shineth in darkness, and the darkness did not comprehend it.

There was a man sent from God, whose name was John. This man came for a witness, to give testimony of the light, that all men might believe through him. He was not the light, but was to give testimony of the light. That was the true light, which enlighteneth every man that cometh into this world.

He was in the world, and the world was made by him, and the world knew him not. He came unto his own, and his own received him not. But as many as received him, he gave them power to be made the sons of God, to them that believe in his name. Who are born, not of blood, nor of the will of the flesh, nor of the will of man, but of God. And the Word was made flesh, and dwelt among us, (and we saw his glory, the glory as it were of the only begotten of the Father,) full of grace and truth.`
    }
  ],
  catechism: [
    {
      id: "baltimore-1",
      title: "Baltimore Catechism — Lesson 1",
      category: "Catechism",
      content: `1. Q. Who made the world?
A. God made the world.

2. Q. Who is God?
A. God is the Creator of heaven and earth, and of all things.

3. Q. What is man?
A. Man is a creature composed of body and soul, and made to the image and likeness of God.

4. Q. Why did God make you?
A. God made me to know Him, to love Him, and to serve Him in this world, and to be happy with Him forever in the next.

5. Q. What must we do to save our souls?
A. To save our souls, we must worship God by faith, hope, and charity; that is, we must believe in Him, hope in Him, and love Him with all our heart.`
    },
    {
      id: "trent-intro",
      title: "Catechism of the Council of Trent (excerpt)",
      category: "Catechism",
      content: `The Catechism of the Council of Trent, also known as the Roman Catechism, was commissioned by the Council of Trent to provide a clear, authoritative exposition of Catholic doctrine for parish priests.

It covers the Creed, the Sacraments, the Commandments, and the Lord’s Prayer, presenting the faith as received from the Apostles and preserved in the Church.`
    }
  ],
  saints: [
    {
      id: "augustine-conf1",
      title: "St. Augustine — Confessions, Book I (excerpt)",
      category: "Saints",
      content: `Great art Thou, O Lord, and greatly to be praised; great is Thy power, and Thy wisdom infinite. And Thee would man praise; man, but a particle of Thy creation; man, that bears about him his mortality, the witness of his sin, the witness that Thou resistest the proud: yet would man praise Thee; he, but a particle of Thy creation.

Thou awakest us to delight in Thy praise; for Thou madest us for Thyself, and our heart is restless, until it repose in Thee.`
    },
    {
      id: "imitatio",
      title: "Imitation of Christ — Book I, Ch. 1",
      category: "Saints",
      content: `He that followeth Me, walketh not in darkness, saith the Lord. These are the words of Christ, by which we are admonished to imitate His life and manners, if we would be truly enlightened, and delivered from all blindness of heart.

Let therefore our chiefest endeavour be, to meditate upon the life of Jesus Christ.`
    }
  ],
  fathers: [
    {
      id: "athanasius",
      title: "St. Athanasius — On the Incarnation (excerpt)",
      category: "Fathers",
      content: `The Word of God, incorporeal, incorruptible, and immaterial, entered our world. In one sense, indeed, He was not far from it before, for no part of creation had ever been without Him Who, while ever abiding in union with the Father, yet fills all things that are.

But now He entered the world in a new way, stooping to our level in His love and Self-revealing to us.`
    }
  ]
};

let currentCategory = "all";
let bookmarks = JSON.parse(localStorage.getItem("catholicBookmarks") || "[]");

function renderList(filter = "") {
  const container = document.getElementById("content");
  let items = [];
  if (currentCategory === "all") {
    Object.values(library).forEach(cat => items.push(...cat));
  } else {
    items = library[currentCategory] || [];
  }
  if (filter) {
    const q = filter.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q));
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

function openReader(id) {
  let item = null;
  for (const cat of Object.values(library)) {
    item = cat.find(i => i.id === id);
    if (item) break;
  }
  if (!item) return;
  const isBookmarked = bookmarks.includes(id);
  document.getElementById("content").innerHTML = `
    <div class="reader">
      <h2>${item.title}</h2>
      <div class="content">${item.content}</div>
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

// Simple service worker registration for offline
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}