const display = document.getElementById('display');
const hint = document.getElementById('hint');

let current = '0';
let previous = null;
let operation = null;
let waitingForOperand = false;

function render() {
  display.textContent = current;
}

function inputDigit(digit) {
  if (waitingForOperand) {
    current = digit;
    waitingForOperand = false;
  } else {
    current = current === '0' ? digit : current + digit;
  }
  render();
}

function inputDot() {
  if (waitingForOperand) {
    current = '0.';
    waitingForOperand = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  render();
}

function clear() {
  current = '0';
  previous = null;
  operation = null;
  waitingForOperand = false;
  hint.textContent = 'Digite no teclado ou clique nos botões';
  render();
}

function backspace() {
  if (waitingForOperand) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  render();
}

function percent() {
  current = String(parseFloat(current) / 100);
  render();
}

function chooseOperation(op) {
  if (operation && !waitingForOperand) {
    calculate();
  }
  previous = parseFloat(current);
  operation = op;
  waitingForOperand = true;
  hint.textContent = `${previous} ${symbolOf(op)}`;
}

function calculate() {
  if (operation === null || previous === null) return;

  const a = previous;
  const b = parseFloat(current);
  let result;

  switch (operation) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      if (b === 0) {
        current = 'Erro';
        operation = null;
        previous = null;
        waitingForOperand = true;
        hint.textContent = 'Divisão por zero';
        render();
        return;
      }
      result = a / b;
      break;
    default: return;
  }

  current = String(parseFloat(result.toPrecision(12)));
  operation = null;
  previous = null;
  waitingForOperand = true;
  hint.textContent = 'Resultado';
  render();
}

function symbolOf(op) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] ?? op;
}

// Botões
document.querySelectorAll('[data-num]').forEach((btn) => {
  btn.addEventListener('click', () => inputDigit(btn.dataset.num));
});
document.querySelector('[data-action="dot"]').addEventListener('click', inputDot);
document.querySelector('[data-action="clear"]').addEventListener('click', clear);
document.querySelector('[data-action="backspace"]').addEventListener('click', backspace);
document.querySelector('[data-action="percent"]').addEventListener('click', percent);
document.querySelector('[data-action="equals"]').addEventListener('click', calculate);
document.querySelectorAll('[data-op]').forEach((btn) => {
  btn.addEventListener('click', () => chooseOperation(btn.dataset.op));
});

// Teclado
window.addEventListener('keydown', (e) => {
  if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
  else if (e.key === '.') inputDot();
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
  else if (e.key === 'Escape') clear();
  else if (e.key === 'Backspace') backspace();
  else if (['+', '-', '*', '/'].includes(e.key)) chooseOperation(e.key);
});

render();
