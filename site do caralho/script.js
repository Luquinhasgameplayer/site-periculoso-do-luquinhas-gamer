// ====== Player principal com visualização ======
const playButton = document.querySelector(".player button");
let mainAudio = new Audio("assets/preview.mp3"); // Beat padrão
let isPlaying = false;

// Canvas de visualização
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = 200;
canvas.style.position = "absolute";
canvas.style.bottom = "0";
canvas.style.left = "0";
canvas.style.zIndex = "-1";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Cria contexto de áudio e analyser
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
let source = audioCtx.createMediaElementSource(mainAudio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;

let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

// Função de animação das ondas
function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    let barHeight = dataArray[i];
    let r = 76, g = 201, b = 240;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    // Glow dourado nos graves
    if (i < 10 && barHeight > 100) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ffd700";
    } else {
      ctx.shadowBlur = 0;
    }

    x += barWidth + 1;
  }
}

// Botão play/pause do player principal
playButton.addEventListener("click", () => {
  if (!isPlaying) {
    mainAudio.play();
    audioCtx.resume();
    playButton.textContent = "⏸";
    isPlaying = true;
    animate();
  } else {
    mainAudio.pause();
    playButton.textContent = "▶";
    isPlaying = false;
  }
});

// ====== Modal de Beats ======
const modal = document.getElementById('beatModal');
const modalContent = modal.querySelector('.modal-content');
const modalTitle = document.getElementById('modal-title');
const modalStyle = document.getElementById('modal-style');
const modalBpm = document.getElementById('modal-bpm');
const modalPrice = document.getElementById('modal-price');
const modalAudio = document.getElementById('modal-audio');
const closeBtn = modal.querySelector('.close');

document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    modalTitle.innerText = card.querySelector('h4').innerText;
    modalStyle.innerText = "Estilo: " + card.dataset.style;
    modalBpm.innerText = "BPM: " + card.dataset.bpm;
    modalPrice.innerText = "Preço: " + card.dataset.price;
    modalAudio.src = `audio/${card.dataset.audio}`;
    modalAudio.currentTime = 0;

    modal.classList.add('show'); // ativa transição
  });
});

function closeModal() {
  modal.classList.remove('show');
  setTimeout(() => {
    modalAudio.pause();
    modalAudio.currentTime = 0;
  }, 300); // espera terminar a transição
}

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});


// ====== Botões de compra ======
document.querySelectorAll(".card button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (!btn.classList.contains('view-btn')) {
      alert("⚡ Em breve checkout seguro com Pix / PayPal / Cartão!");
    }
  });
});

// ====== Responsividade do canvas ======
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
});
