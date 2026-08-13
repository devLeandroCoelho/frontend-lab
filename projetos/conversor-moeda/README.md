# 💱 Conversor de Moeda

Conversor de moedas com interface intuitiva e **validação de valores**,
desenvolvido com HTML, CSS e JavaScript puro (sem dependências).

## 🎯 O que faz

- Conversão entre **BRL, USD, EUR e GBP**
- Botão para **inverter** as moedas (⇄)
- Formatação de valores com `Intl.NumberFormat` (R$ / $ / € / £)
- Validação de entrada (valor obrigatório e não negativo)
- Interface responsiva

> ⚠️ **Taxas de exemplo (offline):** os valores usados são fixos para
> demonstração. Para taxas reais, troque `RATES_TO_BRL` em `script.js` por uma
> API de câmbio (ex.: exchangerate.host, Frankfurter).

## 🚀 Como rodar

1. Abra o arquivo `index.html` no navegador (ou sirva a pasta com `npx serve`).

## 🧠 O que aprendi

- Conversão por moeda-base (BRL como moeda intermediária)
- `Intl.NumberFormat` para formatar moedas por locale
- Validação de formulário e feedback no `aria-live`
- Inversão de estado entre dois selects

## 👨‍💻 Autor

**Leandro Coelho** — [GitHub](https://github.com/devLeandroCoelho) · [LinkedIn](https://linkedin.com/in/devleandrocoelho)
