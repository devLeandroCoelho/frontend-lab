# Frontend Lab

Coleção de exercícios e projetos **front-end (HTML / CSS / JavaScript)** de
Leandro Coelho — cada um resolvido de forma simples, funcional e responsiva,
sem dependências externas.

## 📚 Projetos

### JavaScript Puro (JS/CSS/HTML)

| Projeto | Descrição | Status |
|---|---|---|
| [🧮 Calculadora](./projetos/calculadora/) | Calculadora com as 4 operações básicas | ✅ pronto |
| [⏱️ Cronômetro](./projetos/cronometro/) | Cronômetro com iniciar, pausar e resetar | ✅ pronto |
| [✅ To-Do List](./projetos/todo-list/) | Lista de tarefas com persistência (localStorage) | ✅ pronto |
| [💱 Conversor de Moeda](./projetos/conversor-moeda/) | Conversor de moedas (taxas de exemplo) | ✅ pronto |

## 🚀 Como rodar

Cada projeto é um conjunto de arquivos estáticos — basta abrir o `index.html`
no navegador (ou servir a pasta com um servidor simples):

```bash
# opção 1: abrir direto
open projetos/calculadora/index.html

# opção 2: servidor local
npx serve projetos/
```

## 🗂️ Estrutura

```
frontend-lab/
├── projetos/
│   ├── calculadora/      # operações básicas
│   ├── cronometro/       # tempo + voltas
│   ├── todo-list/        # tarefas + localStorage
│   └── conversor-moeda/  # conversão BRL ↔ USD/EUR
└── README.md             # este índice
```

Novos projetos entram em `projetos/<nome>/` no padrão:
`README.md` (o que faz / como rodar / o que aprendi) + `index.html` + `style.css` + `script.js`.

## 👨‍💻 Autor

**Leandro Coelho** — [GitHub](https://github.com/devLeandroCoelho) · [LinkedIn](https://linkedin.com/in/devleandrocoelho)

## 📄 Licença

MIT — veja [LICENSE](LICENSE).
