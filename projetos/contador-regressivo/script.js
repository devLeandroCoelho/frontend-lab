const setup = document.getElementById('setup');
const inputMinutes = document.getElementById('minutes');
const inputSeconds = document.getElementById('seconds');
const soundToggle = document.getElementById('sound');
const display = document.getElementById('display');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const status = document.getElementById('status');

const STORAGE_KEY = 'contador-regressivo:setup';
const TICK_MS = 200;

let totalMs = 0;        // duração total definida
let remainingMs = 0;    // tempo restante
let running = false;
let frozenAt = null;    // ms congelados no pause
let deadline = 0;       // Date.now() alvo quando rodando
let intervalId = null;
let audioCtx = null;

const TITLE_BASE = 'Contador Regressivo — Frontend Lab';

function clampInput(input) {
  const min = Number(input.min);
  const max = Number(input.max);
  let value = Number(input.value);
  if (Number.isNaN(value)) value = 0;
  input.value = String(Math.min(Math.max(value, min), max));
}

function readSetup() {
  return Number(inputMinutes.value) * 60000 + Number(inputSeconds.value) * 1000;
}

function format(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function render() {
  display.textContent = format(remainingMs);
  display.setAttribute('aria-busy', running ? 'true' : 'false');
  document.title = running ? `${format(remainingMs)} · ${TITLE_BASE}` : TITLE_BASE;

  const ratio = totalMs > 0 ? Math.min(1, remainingMs / totalMs) : 0;
  progressFill.style.width = `${ratio * 100}%`;
  progress.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
}

function announce(message) {
  status.textContent = message;
  status.hidden = false;
}

// ---- áudio (Web Audio, criado sob gesto do usuário) ----

function createAudio() {
  if (audioCtx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (Ctx) audioCtx = new Ctx();
}

function beep(count) {
  if (!soundToggle.checked || !audioCtx) return;
  let delay = 0;
  for (let i = 0; i < count; i += 1) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + 0.3);
    delay += 0.35;
  }
}

// ---- ciclo de contagem ----

function setCountdown() {
  clearInterval(intervalId);
  running = false;
  frozenAt = null;
  totalMs = readSetup();
  remainingMs = totalMs;
  btnStart.disabled = false;
  btnPause.disabled = true;
  status.hidden = true;
  render();
}

function start() {
  if (running || remainingMs <= 0) return;
  createAudio();
  running = true;
  deadline = Date.now() + remainingMs;
  intervalId = setInterval(tick, TICK_MS);
  btnStart.disabled = true;
  btnPause.disabled = false;
  tick();
}

function pause() {
  if (!running) return;
  frozenAt = Date.now();
  clearInterval(intervalId);
  remainingMs = Math.max(0, deadline - frozenAt);
  running = false;
  btnStart.disabled = false;
  btnPause.disabled = true;
  render();
}

function reset() {
  clearInterval(intervalId);
  running = false;
  frozenAt = null;
  remainingMs = totalMs;
  btnStart.disabled = false;
  btnPause.disabled = true;
  status.hidden = true;
  render();
}

function finish() {
  clearInterval(intervalId);
  running = false;
  remainingMs = 0;
  btnStart.disabled = true;
  btnPause.disabled = true;
  announce('⏰ Tempo concluído!');
  beep(3);
  render();
}

function tick() {
  remainingMs = Math.max(0, deadline - Date.now());
  render();
  if (remainingMs <= 0) finish();
}

// ---- eventos ----

setup.addEventListener('submit', (event) => {
  event.preventDefault();
  clampInput(inputMinutes);
  clampInput(inputSeconds);
  const minutes = Number(inputMinutes.value);
  const seconds = Number(inputSeconds.value);
  const pretty = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ minutes, seconds }));
  } catch {
    // armazenamento indisponível: segue sem persistir
  }
  setCountdown();
  announce(`Tempo definido para ${pretty}.`);
});

btnStart.addEventListener('click', start);
btnPause.addEventListener('click', pause);
btnReset.addEventListener('click', reset);

// ---- inicialização: restaura última configuração ----

(function restore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Number.isInteger(saved?.minutes) && Number.isInteger(saved?.seconds)) {
      inputMinutes.value = String(saved.minutes);
      inputSeconds.value = String(saved.seconds);
    }
  } catch {
    // dado corrompido: usa o padrão
  }
  setCountdown();
})();