const form = document.getElementById('form');
const input = document.getElementById('input');
const list = document.getElementById('list');
const counter = document.getElementById('counter');
const clearDone = document.getElementById('clear-done');
const clearAll = document.getElementById('clear-all');

const STORAGE_KEY = 'frontend-lab.todos';

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

let todos = loadTodos();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';
  const remaining = todos.filter((t) => !t.done).length;
  counter.textContent = `${remaining} de ${todos.length} ${todos.length === 1 ? 'tarefa' : 'tarefas'} pendente${remaining === 1 ? '' : 's'}`;

  if (todos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'todo__empty';
    empty.textContent = 'Nenhuma tarefa ainda — adicione a primeira!';
    list.appendChild(empty);
    return;
  }

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo__item' + (todo.done ? ' todo__item--done' : '');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'todo__check';
    check.checked = todo.done;
    check.setAttribute('aria-label', `Marcar "${todo.text}" como ${todo.done ? 'pendente' : 'concluída'}`);
    check.addEventListener('change', () => toggle(index));

    const span = document.createElement('span');
    span.className = 'todo__text';
    span.textContent = todo.text;

    const remove = document.createElement('button');
    remove.className = 'todo__remove';
    remove.textContent = '✕';
    remove.setAttribute('aria-label', `Remover "${todo.text}"`);
    remove.addEventListener('click', () => removeAt(index));

    li.append(check, span, remove);
    list.appendChild(li);
  });
}

function addTodo(text) {
  const clean = text.trim();
  if (!clean) return;
  todos.push({ text: clean, done: false });
  save();
  render();
}

function toggle(index) {
  todos[index].done = !todos[index].done;
  save();
  render();
}

function removeAt(index) {
  todos.splice(index, 1);
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  save();
  render();
}

function clearAllTodos() {
  if (todos.length > 0 && !window.confirm('Remover todas as tarefas?')) return;
  todos = [];
  save();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

clearDone.addEventListener('click', clearCompleted);
clearAll.addEventListener('click', clearAllTodos);

render();
