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
  "IMG_6143.JPG",
  "WhatsApp Image 2026-02-13 at 7.24.06 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.06 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.40 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.37 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.38 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.39 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.40 AM (2).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.41 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.41 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.42 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.43 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.44 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.43 AM.jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.43 AM (2).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.45 AM (1).jpeg",
  "WhatsApp Image 2026-02-13 at 7.24.45 AM (1).jpeg"
];

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

/* ===== Smooth Heart Shower (Canvas) - fast ===== */
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
   ✅ Carousel logic (STACK + rotate + 2s change)
   ========================================================= */

let polaroids = [];

function buildPolaroids() {
  polaroidStack.innerHTML = "";

  imageFiles.forEach((file) => {
    const pol = document.createElement("div");
    pol.className = "polaroid";

    const photoWrap = document.createElement("div");
    photoWrap.className = "photo";

    const img = document.createElement("img");
    img.className = "photoImg";
    img.src = file;
    img.alt = "Our photo";

    photoWrap.innerHTML = "";
    photoWrap.appendChild(img);

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = "💖";

    pol.appendChild(photoWrap);
    pol.appendChild(caption);

    polaroidStack.appendChild(pol);
  });

  polaroids = Array.from(document.querySelectorAll(".polaroid"));
}

/* Apply classes so that:
   - current is active (front)
   - next 3 are visible behind as stack-1/2/3
   - everything else hidden
*/
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

function startCarousel() {
  if (carouselTimer) return;

  renderStack();

  carouselTimer = setInterval(() => {
    // move current to the back by simply advancing index
    currentIndex = (currentIndex + 1) % polaroids.length;
    renderStack();
  }, 2000); // ✅ change every 2 seconds
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

  // build the polaroids with your images (only once is fine)
  if (polaroids.length === 0) {
    buildPolaroids();
  }

  currentIndex = 0;
  startCarousel();
});
