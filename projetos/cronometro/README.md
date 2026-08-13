# ⏱️ Cronômetro

Cronômetro digital com **iniciar, pausar, resetar e marcação de voltas**,
desenvolvido com HTML, CSS e JavaScript puro.

## 🎯 O que faz

- Iniciar, pausar e resetar a contagem
- Marcação de voltas (laps) durante a corrida
- Formato `HH:MM:SS` com precisão de décimos na atualização
- Interface responsiva

## 🚀 Como rodar

1. Abra o arquivo `index.html` no navegador (ou sirva a pasta com `npx serve`).

## 🧠 O que aprendi

- `setInterval` vs `Date.now()` para contagem precisa (sem drift)
- Acumular tempo entre pausas (`accumulated + (now - start)`)
- Estados de botões habilitados/desabilitados conforme o estado do timer
- Criação dinâmica de elementos da lista de voltas

## 👨‍💻 Autor

**Leandro Coelho** — [GitHub](https://github.com/devLeandroCoelho) · [LinkedIn](https://linkedin.com/in/devleandrocoelho)
