// Update this list only. Everything else auto-renders.
const works = [
  { file: "Curve.png", title: "Curve", categories: ["abstract"] },
  {
    file: "Dancing_Confetti.png",
    title: "Dancing Confetti",
    categories: ["abstract"],
  },
  { file: "Cubism.png", title: "Cubism", categories: ["abstract", "figure"] },
  { file: "Baller.png", title: "Baller", categories: ["figure"] },
  { file: "BMX.png", title: "BMX", categories: ["figure"] },
  { file: "Cobra.png", title: "Cobra", categories: ["figure"] },
  { file: "Cockatoo.png", title: "Cockatoo", categories: ["figure"] },
  { file: "Deer_Earth.png", title: "Deer (Earth)", categories: ["figure"] },
  { file: "Dolphin.png", title: "Dolphin", categories: ["figure"] },
  { file: "El_Toro.png", title: "El Toro", categories: ["figure"] },

  {
    file: "Jesus.png",
    title: "Jesus",
    categories: ["faith"],
  },
  {
    file: "Father_in_heaven.png",
    title: "Father in Heaven",
    categories: ["faith"],
  },
  {
    file: "Family_Outing.png",
    title: "Family Outing",
    categories: ["faith, figure"],
  },
  {
    file: "SaviorAndChild.png",
    title: "Savior and Child",
    categories: ["faith"],
  },

  // Add your faith pieces here later:
  // { file: "Jesus.png", title: "Jesus", categories: ["faith", "figure"] },
];

const grid = document.getElementById("grid");
const chips = Array.from(document.querySelectorAll(".chip[data-filter]"));
const countEl = document.getElementById("count");
const yearEl = document.getElementById("year");

const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbSub = document.getElementById("lbSub");
const lbClose = document.getElementById("lbClose");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const openFile = document.getElementById("openFile");

const themeBtn = document.getElementById("themeBtn");
const themeLabel = document.getElementById("themeLabel");

let activeFilter = "all";
let filtered = [...works];
let currentIndex = 0;

function tagText(cats) {
  // nice label under the title
  if (cats.includes("faith")) return "Faith";
  if (cats.includes("abstract") && cats.includes("figure"))
    return "Abstract • Figure";
  if (cats.includes("abstract")) return "Abstract";
  if (cats.includes("figure")) return "Figure";
  return "Work";
}

function applyFilter() {
  filtered =
    activeFilter === "all"
      ? [...works]
      : works.filter((w) => w.categories.includes(activeFilter));

  render();
}

function render() {
  grid.innerHTML = "";

  filtered.forEach((w, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    card.innerHTML = `
      <img src="images/${w.file}" alt="${w.title}" loading="lazy" />
      <div class="meta">
        <div class="title">${w.title}</div>
        <div class="sub">${tagText(w.categories)}</div>
      </div>
    `;

    card.addEventListener("click", () => openLightbox(i));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openLightbox(i);
    });

    grid.appendChild(card);
  });

  countEl.textContent = `${filtered.length} piece${
    filtered.length === 1 ? "" : "s"
  }`;
}

function openLightbox(i) {
  currentIndex = i;
  const w = filtered[currentIndex];

  lbImg.src = `images/${w.file}`;
  lbImg.alt = w.title;

  lbTitle.textContent = w.title;
  lbSub.textContent = tagText(w.categories);
  openFile.href = `images/${w.file}`;

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function prev() {
  currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
  openLightbox(currentIndex);
}

function next() {
  currentIndex = (currentIndex + 1) % filtered.length;
  openLightbox(currentIndex);
}

// Filter buttons (category chips only)
chips.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    if (!filter) return; // safety guard (prevents theme button bug)

    activeFilter = filter;
    chips.forEach((b) => b.classList.toggle("is-active", b === btn));
    applyFilter();
  });
});

// Lightbox controls
lbClose.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (e) => {
  const open = lightbox.classList.contains("is-open");
  if (!open) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});

// --- Theme (saved) ---
function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
  if (themeLabel) themeLabel.textContent = mode === "light" ? "Light" : "Dark";
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  setTheme(savedTheme);
} else {
  // default is dark (your current design)
  setTheme("dark");
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

// Init
yearEl.textContent = new Date().getFullYear();
applyFilter();
