const form = document.getElementById('form');
const amount = document.getElementById('amount');
const from = document.getElementById('from');
const to = document.getElementById('to');
const swap = document.getElementById('swap');
const resultValue = document.getElementById('result-value');
const resultRate = document.getElementById('result-rate');

// Taxas de exemplo baseadas em 1 BRL (offline — sem dependência de API).
const RATES_TO_BRL = {
  BRL: 1,
  USD: 5.2,
  EUR: 5.65,
  GBP: 6.6,
};

function convert(value, fromCode, toCode) {
  const valueInBRL = value / RATES_TO_BRL[fromCode];
  return valueInBRL * RATES_TO_BRL[toCode];
}

function formatMoney(value, code) {
  const locale = code === 'BRL' ? 'pt-BR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(value);
}

function runConversion() {
  const value = parseFloat(amount.value);
  if (!Number.isFinite(value) || value < 0) {
    resultValue.textContent = 'Informe um valor válido';
    resultRate.textContent = '';
    return;
  }

  const fromCode = from.value;
  const toCode = to.value;
  const converted = convert(value, fromCode, toCode);

  resultValue.textContent = formatMoney(converted, toCode);

  const rate = RATES_TO_BRL[fromCode] / RATES_TO_BRL[toCode];
  resultRate.textContent = `1 ${fromCode} = ${rate.toFixed(4)} ${toCode}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  runConversion();
});

swap.addEventListener('click', () => {
  const tmp = from.value;
  from.value = to.value;
  to.value = tmp;
  runConversion();
});

runConversion();
