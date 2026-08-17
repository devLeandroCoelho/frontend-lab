/**
 * Validação estrutural do frontend-lab (zero dependências).
 *
 * Roda no CI (GitHub Actions) em PRs e na main. Verifica:
 *   1. Estrutura mínima de cada projeto em projetos/<nome>/:
 *      README.md, index.html, script.js e style.css presentes.
 *   2. HTML bem formado em nível básico: doctype, <html>, <head>,
 *      <title> não-vazio, <body>, e balanço de tags (sem self-close).
 *   3. Links relativos nos READMEs apontam para arquivos/dirs existentes
 *      (links absolutos https:// são ignorados).
 *
 * Uso: node .github/scripts/validate.mjs
 * Saída: exit 0 se tudo ok; exit 1 com lista de erros caso contrário.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const PROJETOS = join(ROOT, 'projetos');

const REQUIRED_FILES = ['README.md', 'index.html', 'script.js', 'style.css'];
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

const errors = [];

function fail(msg) {
  errors.push(msg);
}

/** Extrai o alvo dos links markdown relativos: [texto](./caminho). */
function relativeLinkTargets(mdContent) {
  const targets = [];
  const re = /\]\((?!https?:\/\/|mailto:|#)([^)\s]+)\)/g;
  let m;
  while ((m = re.exec(mdContent)) !== null) {
    targets.push(m[1].replace(/\.md$/, '').replace(/\/+$/, ''));
  }
  return targets;
}

/** Validação básica de HTML: estrutura mínima + balanço de tags. */
function validateHtml(filePath) {
  const html = readFileSync(filePath, 'utf8');

  if (!/^<!DOCTYPE\s+html>/i.test(html)) {
    fail(`${filePath}: falta <!DOCTYPE html>`);
  }
  for (const [tag, label] of [
    ['<html', '<html>'],
    ['<head', '<head>'],
    ['<body', '<body>'],
  ]) {
    if (!html.includes(tag)) fail(`${filePath}: falta ${label}`);
  }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    fail(`${filePath}: <title> ausente ou vazio`);
  }

  // Balanço de tags (ignora comentários HTML)
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
  const stack = [];
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const [full, tag, rest] = m;
    if (rest.trim().startsWith('--')) continue; // comentário
    const lower = tag.toLowerCase();
    if (full.startsWith('</')) {
      const open = stack.pop();
      if (open !== lower) {
        fail(`${filePath}: tag </${tag}> sem correspondência com <${open ?? '?'}>`);
        return;
      }
    } else if (!rest.endsWith('/') && !VOID_TAGS.has(lower)) {
      stack.push(lower);
    }
  }
  if (stack.length > 0) {
    fail(`${filePath}: tags não fechadas: ${stack.join(', ')}`);
  }
}

// 1. Estrutura mínima dos projetos
let projectDirs = [];
try {
  projectDirs = readdirSync(PROJETOS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
} catch {
  fail(`diretório projetos/ não encontrado em ${ROOT}`);
}

if (projectDirs.length === 0) fail('nenhum projeto encontrado em projetos/');

for (const dir of projectDirs) {
  const base = join(PROJETOS, dir);
  for (const file of REQUIRED_FILES) {
    if (!existsSync(join(base, file))) {
      fail(`projetos/${dir}/: falta arquivo obrigatório ${file}`);
    }
  }
  const indexHtml = join(base, 'index.html');
  if (existsSync(indexHtml)) validateHtml(indexHtml);
}

// 2. Links relativos nos READMEs
const readmes = [];
for (const dir of projectDirs) readmes.push(join(PROJETOS, dir, 'README.md'));
readmes.push(join(ROOT, 'README.md'));

for (const readme of readmes) {
  if (!existsSync(readme)) continue;
  const content = readFileSync(readme, 'utf8');
  for (const target of relativeLinkTargets(content)) {
    const abs = resolve(join(readme, '..'), target);
    if (!existsSync(abs)) {
      fail(`${readme}: link relativo quebrado -> ${target}`);
    }
  }
}

// 3. Sem arquivos .html fora de projetos/ (padrão do repo)
const stray = [];
for (const entry of readdirSync(ROOT)) {
  if (entry === 'projetos' || entry.startsWith('.') || entry === 'scripts') continue;
  if (extname(entry) === '.html') stray.push(entry);
}
if (stray.length > 0) {
  fail(`HTML na raiz (mover para projetos/): ${stray.join(', ')}`);
}

if (errors.length > 0) {
  console.error(`[validate] ${errors.length} erro(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`[validate] OK — ${projectDirs.length} projeto(s), ${readmes.length} README(s) validados.`);
