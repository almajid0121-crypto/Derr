
const GEMINI_API_KEY = "YOUR_GOOGLE_GEMINI_API_KEY"; 

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`; 

const slider = document.getElementById('project-slider');
const dotsContainer = document.getElementById('slider-nav-dots');
const cards = document.querySelectorAll('.project-card');
let currentSlide = 0;

function createDots() {
    cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
}

function updateDots(index) {
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) dot.classList.add('active');
    });
}

function moveToSlide(index) {
    currentSlide = index;
    const offset = -currentSlide * 100;
    slider.style.transform = `translateX(${offset}%)`;
    updateDots(index);
}

setInterval(() => {
    let nextSlide = (currentSlide + 1) % cards.length;
    moveToSlide(nextSlide);
}, 5000);
createDots();

const modal = document.getElementById("contactModal");
const modalTitle = document.getElementById("modal-title");
const modalDetails = document.getElementById("modal-content-details");

function openContactModal(type) {
    let title = "";
    let content = "";

    switch (type) {
        case 'email':
            title = "Contact via Email";
            content = `
                <p>Your professional email:</p>
                <a href="mailto:DerrNotDev@gmail.com" target="_blank">
                    <i class="fas fa-envelope"></i> DerrNotDev@gmail.com
                </a>
            `;
            break;

        case 'whatsapp':
            title = "Contact via WhatsApp";
            content = `
                <p>WhatsApp Number (Click to chat):</p>
                <a href="https://wa.me/6281617434605" target="_blank">
                    <i class="fab fa-whatsapp"></i> 6281617434605
                </a>
            `;
            break;

        case 'linkedin':
            title = "Social Media Connection";
            content = `
                <p>Let's connect on professional platform:</p>
                <a href="#" target="_blank">
                    <i class="fab fa-linkedin"></i> LinkedIn (Link not set)
                </a>
            `;
            break;

        case 'qris_info':
            title = "Alternative Payment Details";
            content = `
                <p>If QRIS does not work, use:</p>
                <a href="#"><i class="fas fa-wallet"></i> Dana/GoPay: 081617434605 </a>
                <a href="#"><i class="fas fa-university"></i> Bank Transfer: Bank ABC (Coming Soon)</a>
            `;
            break;
    }

    modalTitle.textContent = title;
    modalDetails.innerHTML = content;
    modal.style.display = "block";
}

function closeContactModal() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeContactModal();
    }
};

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

async function sendMessage() {
    const messageText = userInput.value.trim();
    if (messageText === "") return;

    appendMessage(messageText, 'user');
    userInput.value = '';
    sendButton.disabled = true;

    const typingIndicator = appendMessage('AI is typing...', 'ai');

    try {
        const response = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: messageText }] }
                ]
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Gemini API Error Response:", errorDetails);
            throw new Error(`Gemini API failed to respond. Status: ${response.status}. Details: ${errorDetails.error?.message || 'Unknown error.'}`);
        }

        const data = await response.json();
        
        const aiResponse = data.candidates[0].content.parts[0].text;

        typingIndicator.remove();
        appendMessage(aiResponse, 'ai');

    } catch (error) {
        console.error("AI Error:", error);
        typingIndicator.textContent = `[Gemini API Error] ${error.message}. Check API Key at the top of the code.`;
    } finally {
        sendButton.disabled = false;
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}

function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

const music = document.getElementById("bg-music");
const musicBtn = document.querySelector(".music-control");

function toggleMusic() {
  if (music.paused) {
    music.muted = false;
    music.play();
    musicBtn.textContent = "⏸ Pause";
  } else {
    music.pause();
    musicBtn.textContent = "▶ Play";
  }
}


const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let hue = 0;

class Particle {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = `hsl(${hue}, 100%, 60%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    this.color = `hsl(${hue}, 100%, 60%)`;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i = 0; i < 120; i++) {
    let size = Math.random() * 3 + 1;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let speedX = (Math.random() - 0.5) * 1.5;
    let speedY = (Math.random() - 0.5) * 1.5;
    particlesArray.push(new Particle(x, y, size, speedX, speedY));
  }
}

function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hue += 0.5;

  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});


function createStar() {
  const star = document.createElement("div");
  star.classList.add("shooting-star");
  star.style.left = Math.random() * window.innerWidth + "px";
  star.style.top = Math.random() * 100 + "px";

  const size = Math.random() * 2 + 1;
  star.style.width = size + "px";
  star.style.height = size * 40 + "px";

  document.body.appendChild(star);

  setTimeout(() => { star.remove(); }, 2000);
}

setInterval(() => {
  for (let i = 0; i < 3; i++) {
    setTimeout(createStar, i * 300);
  }
}, 1500);
