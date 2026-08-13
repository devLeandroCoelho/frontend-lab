const display = document.getElementById('display');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const btnLap = document.getElementById('btn-lap');
const laps = document.getElementById('laps');

let running = false;
let startTime = 0;
let accumulated = 0; // ms acumulados antes do pause
let intervalId = null;
let lapCount = 0;

function format(ms) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function tick() {
  const elapsed = accumulated + (Date.now() - startTime);
  display.textContent = format(elapsed);
}

function start() {
  if (running) return;
  running = true;
  startTime = Date.now();
  intervalId = setInterval(tick, 100);
  btnStart.disabled = true;
  btnPause.disabled = false;
  btnLap.disabled = false;
}

function pause() {
  if (!running) return;
  accumulated += Date.now() - startTime;
  clearInterval(intervalId);
  running = false;
  btnStart.disabled = false;
  btnPause.disabled = true;
  btnLap.disabled = true;
}

function reset() {
  clearInterval(intervalId);
  running = false;
  accumulated = 0;
  lapCount = 0;
  display.textContent = '00:00:00';
  laps.innerHTML = '';
  btnStart.disabled = false;
  btnPause.disabled = true;
  btnLap.disabled = true;
}

function lap() {
  if (!running) return;
  lapCount += 1;
  const elapsed = accumulated + (Date.now() - startTime);
  const li = document.createElement('li');
  const name = document.createElement('span');
  const time = document.createElement('span');
  name.textContent = `Volta ${String(lapCount).padStart(2, '0')}`;
  time.textContent = format(elapsed);
  li.append(name, time);
  laps.prepend(li);
}

btnStart.addEventListener('click', start);
btnPause.addEventListener('click', pause);
btnReset.addEventListener('click', reset);
btnLap.addEventListener('click', lap);
