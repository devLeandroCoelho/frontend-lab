# ⏳ Contador Regressivo

Contador regressivo **acessível** com configuração de minutos e segundos,
barra de progresso, aviso sonoro (Web Audio) e anúncio de conclusão via
region live de ARIA. Desenvolvido com HTML, CSS e JavaScript puro.

## 🎯 O que faz

- Definir tempo em minutos e segundos (0–59)
- Iniciar, pausar, resetar e redefinir a contagem
- Barra de progresso com `role="progressbar"` e `aria-valuenow` dinâmico
- `role="timer"` + `aria-live` no display (leitores de tela anunciam o tempo)
- Anúncio de conclusão em region live (`role="status"`) + **som** opcional
- Título da aba atualizado com o tempo restante
- Persistência da última configuração (localStorage)

## ♿ Acessibilidade (WCAG 2.1 AA)

- Alvos de toque ≥ 44px (`min-height: 48px`)
- Foco visível em todos os controles (`:focus-visible`)
- Contraste WCAG AA em textos e controles
- Animações desativadas com `prefers-reduced-motion`
- Navegação 100% por teclado (Tab + Enter/Espaço)
- Áudio criado por gesto do usuário e com checkbox "Som ao terminar"
  (desligável)

## 🚀 Como rodar

1. Abra o arquivo `index.html` no navegador (ou sirva a pasta com `npx serve`).

## 🧠 O que aprendi

- `Date.now()` + deadline em vez de decrementar a cada `setInterval` (sem drift)
- Atualização do `aria-valuenow` conforme o progresso real
- Web Audio API: beeps criados sob demanda (gesto do usuário)
- Regions live (`role="status"` / `aria-live`) para anunciar mudanças a
  leitores de tela
- `prefers-reduced-motion` para respeitar usuários sensíveis a movimento

## 👨‍💻 Autor

**Leandro Coelho** — [GitHub](https://github.com/devLeandroCoelho) · [LinkedIn](https://linkedin.com/in/devleandrocoelho)