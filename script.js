const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");

const questionArea  = document.getElementById("questionArea");
const yesScreen      = document.getElementById("yesScreen");
const nextBtn        = document.getElementById("nextBtn");
const galleryScreen  = document.getElementById("galleryScreen");

const polaroidStack = document.getElementById("polaroidStack");

let currentIndex = 0;
let carouselTimer = null;

/* ===== Your Images List (exact filenames) ===== */
const imageFiles = [
  "Snapchat-195503374.jpg",
  "IMG_5972.JPG",
  "IMG-20231101-WA0076.jpg",
  "IMG-20231113-WA0092.jpg",
  "WhatsApp Image 2026-02-13 at 7.24.05 AM.jpeg",
  "IMG_8293.JPG",
  "IMG_8857.JPG",
  "WhatsApp Image 2026-02-13 at 7.24.06 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.06 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.37 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.38 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.40 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.39 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.40 AM (2).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.41 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.41 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.42 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.43 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.44 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.43 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.43 AM (2).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.45 AM (1).jpeg"
];

/* ===== Text for each image (same order) ===== */
const imageTexts = [
  "First Meet - The day when our online convos turned into real life dates. My heart felt at home meeting you the first time. That day i chose you - for life. (25/09/2023)" ,
  "Our little Cafe date at Shakespeares , spoiling me with the best food since day one.",
  "Kerala piravi function at my college, you travelled all the way just to see me and that day i felt chosen in the most beautiful way in my heart and the pictures you captured.(01/11/2023)",
  "The last day of your first vacation with me. Not a goodbye, just a pause before our forever begins",
  "The 'we made it moment'. Officially 'us' in front of all the people (10/01/2024)",
  "Our little secret trip to Alappuzha, just us, the waves, and obviously foood.",
  "Extra special Stay cation to Ilaveezhapoonchira and our perfectly imperfect picture where we laughed from our hearts",
  "Save The Date - Even the storm wanted to be a part of our forever, our save the date pictures shined through the unexpected rain.(02/12/2024)",
  "Wedding Day - The moment our love became halal, surrounded by duas, family and friends .Starting of our husband and wife journey. (08/12/2024)",
  "Kashmir Days - Matching outfits in the cold snow, perfectly matched, perfectly in love during our honeymoon in winter wonderland. (15/12/2024)",
  "Shamnu's Save the Date - Cute little moment at the cafe, stealing all my love during save the date shoot.(23/12/2024)",
  "Shamnu's Wedding - All dressed up, hand in hand, glowing and shining together as newlyweds.(28/12/2024 )",
  "Throughout the weddings all dressed up and stealing the hearts.",
  "Dubai Airport - Finally ending the long distance, sweetest meet after miles and months, with a beautiful bouquet and a whole lot of love.(30/05/2025)",
  "First Eid - Dressed in our finest, celebrating our first eid as 'us'.(06/06/2025)",
  "Under the glow of Sheikh Zayed, hand in hand - another magical night with you. (06/06/2025)",
  "First birthday Together - Under the warm glow celebrating my first birthday with you. (24/06/2025)",
  "Anniversary - Celebrating our first anniversary under the purple sky alongside the prettiest lake, making the sweetest memories with the sweetest cheesecakes.(08/12/2025 )",
  "New Year - Under the burj khalifa in all its glory and lights, we celebrated our second new year together with the most magical fireworks in sight.(01/01/2026 )",
  "Movie date vibes at wafi mall with all its aesthetic beauty and us with cute smiles. (23/11/2025)",
  "Sunrise dripped in morning glow + hoodies for the chilly air , Al kudra lake mornings are pure magic. (28/12/2025)",
  "Jumeirah with its aesthetics, same us new place and many more to goooooo.....Inshallah(03/02/2026)"
];

/* ===== Helper: ensure a heart at end ===== */
function withHeart(text) {
  const t = (text || "").trim();
  if (!t) return "💖";
  if (/[💖💘💗💞❤️]$/.test(t)) return t;
  return `${t} 💖`;
}

/* ===== NO button runs away ===== */
function moveNoButton() {
  noBtn.style.position = "absolute";

  const card = document.querySelector(".card");
  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 18;
  const maxX = cardRect.width - btnRect.width - padding;
  const maxY = cardRect.height - btnRect.height - padding;

  const x = Math.floor(Math.random() * Math.max(40, maxX)) + padding / 2;
  const y = Math.floor(Math.random() * Math.max(90, maxY)) + padding / 2;

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
});

/* ===== Smooth Heart Shower (Canvas) ===== */
const canvas = document.getElementById("fxCanvas");
const ctx = canvas.getContext("2d", { alpha: true });

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let hearts = [];
let animId = null;
let heartsRunning = false;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function drawHeart(x, y, size, rotation, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, -s * 0.2);
  ctx.bezierCurveTo(s * 0.5, -s * 0.8, s * 1.4, -s * 0.05, 0, s);
  ctx.bezierCurveTo(-s * 1.4, -s * 0.05, -s * 0.5, -s * 0.8, 0, -s * 0.2);
  ctx.closePath();

  const colors = ["#ff1f5a", "#ff4d6d", "#ff6b88", "#ffd1dc"];
  ctx.fillStyle = colors[(Math.random() * colors.length) | 0];
  ctx.fill();

  ctx.restore();
}

function spawnHearts(count = 40) {
  for (let i = 0; i < count; i++) {
    hearts.push({
      x: rand(0, canvas.width),
      y: canvas.height + rand(0, 120),
      vy: rand(1.2, 3.2),
      vx: rand(-0.6, 0.6),
      size: rand(6, 14),
      rot: rand(-0.6, 0.6),
      vr: rand(-0.02, 0.02),
      life: rand(120, 200)
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const h of hearts) {
    h.x += h.vx;
    h.y -= h.vy;
    h.rot += h.vr;
    h.life -= 1;

    const alpha = Math.max(0, Math.min(1, h.life / 160));
    drawHeart(h.x, h.y, h.size, h.rot, alpha);
  }

  hearts = hearts.filter(h => h.life > 0 && h.y > -60);

  if (heartsRunning) {
    spawnHearts(5);
  }

  animId = requestAnimationFrame(animate);
}

function startLoveEffect() {
  heartsRunning = true;
  if (!animId) animate();
}

/* =========================================================
   ✅ Carousel logic (STACK + 4s timing + arrows)
   ========================================================= */

let polaroids = [];

function ensureNavButtons() {
  const existing = document.querySelector(".carouselNav");
  if (existing) return;

  const nav = document.createElement("div");
  nav.className = "carouselNav";

  const prev = document.createElement("button");
  prev.className = "navBtn navPrev";
  prev.type = "button";
  prev.textContent = "<";

  const next = document.createElement("button");
  next.className = "navBtn navNext";
  next.type = "button";
  next.textContent = ">";

  prev.addEventListener("click", () => {
    stopCarousel();
    currentIndex = (currentIndex - 1 + polaroids.length) % polaroids.length;
    renderStack();
    startCarousel();
  });

  next.addEventListener("click", () => {
    stopCarousel();
    currentIndex = (currentIndex + 1) % polaroids.length;
    renderStack();
    startCarousel();
  });

  nav.appendChild(prev);
  nav.appendChild(next);

  const card = document.querySelector(".card");
  card.appendChild(nav);
}

function buildPolaroids() {
  polaroidStack.innerHTML = "";

  imageFiles.forEach((file, i) => {
    const pol = document.createElement("div");
    pol.className = "polaroid";

    const photoWrap = document.createElement("div");
    photoWrap.className = "photo";

    const img = document.createElement("img");
    img.className = "photoImg";
    img.src = file;
    img.alt = "Our photo";

    photoWrap.appendChild(img);

    // ✅ caption removed entirely (no extra space)

    const story = document.createElement("div");
    story.className = "storyText";
    story.textContent = withHeart(imageTexts[i] || "");

    pol.appendChild(photoWrap);
    pol.appendChild(story);

    polaroidStack.appendChild(pol);
  });

  polaroids = Array.from(document.querySelectorAll(".polaroid"));
  ensureNavButtons();
}

function renderStack() {
  polaroids.forEach(p => {
    p.classList.remove("active", "stack-1", "stack-2", "stack-3");
  });

  if (polaroids.length === 0) return;

  const front = currentIndex;
  const s1 = (currentIndex + 1) % polaroids.length;
  const s2 = (currentIndex + 2) % polaroids.length;
  const s3 = (currentIndex + 3) % polaroids.length;

  polaroids[front].classList.add("active");
  if (polaroids.length > 1) polaroids[s1].classList.add("stack-1");
  if (polaroids.length > 2) polaroids[s2].classList.add("stack-2");
  if (polaroids.length > 3) polaroids[s3].classList.add("stack-3");
}

function stopCarousel() {
  if (carouselTimer) {
    clearTimeout(carouselTimer);
    carouselTimer = null;
  }
}

function startCarousel() {
  if (carouselTimer) return;

  renderStack();

  const step = () => {
    carouselTimer = setTimeout(() => {
      currentIndex = (currentIndex + 1) % polaroids.length;
      renderStack();
      step();
    }, 10000); // ✅ fixed 4 seconds for each photo
  };

  step();
}

/* YES click */
yesBtn.addEventListener("click", () => {
  questionArea.classList.add("hidden");
  yesScreen.classList.remove("hidden");
  startLoveEffect();
});

/* Next Surprise click */
nextBtn.addEventListener("click", () => {
  yesScreen.classList.add("hidden");
  galleryScreen.classList.remove("hidden");

  if (polaroids.length === 0) {
    buildPolaroids();
  }

  stopCarousel();
  currentIndex = 0;
  startCarousel();
});
