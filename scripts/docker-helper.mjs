#!/usr/bin/env node
// OPTICIAN CMS — Docker Manager
// npm run docker

import { execSync } from "child_process";
import { createInterface } from "readline";

const R = "\x1b[0m", B = "\x1b[1m", D = "\x1b[2m";
const W = "\x1b[37m", RD = "\x1b[31m", G = "\x1b[32m", Y = "\x1b[33m", C = "\x1b[36m", M = "\x1b[35m";
const EL = "\x1b[2K"; // erase line
const UP = (n) => `\x1b[${n}A`;
const HC = "\x1b[?25l", SC = "\x1b[?25h";

const cmds = [
  { label: "Production — Build & Start",  desc: "Build + lance en production (détaché)", cmd: "docker compose up --build -d", danger: false },
  { label: "Dev — Build & Start",         desc: "Dev avec hot-reload (Ctrl+C pour arrêter)", cmd: "docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build", danger: false },
  { label: "Dev — Détaché",               desc: "Dev en arrière-plan", cmd: "docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d", danger: false },
  { sep: true },
  { label: "Logs",                         desc: "Logs temps réel (Ctrl+C pour quitter)", cmd: "docker compose logs -f", danger: false },
  { label: "Status",                       desc: "État des containers", cmd: "docker compose ps", danger: false },
  { label: "Restart",                      desc: "Redémarrer sans rebuild", cmd: "docker compose restart", danger: false },
  { label: "Stop",                         desc: "Arrêter les containers (données préservées)", cmd: "docker compose down", danger: false },
  { sep: true },
  { label: "Shell — Web",                  desc: "Terminal dans le container Next.js", cmd: "docker compose exec web sh", danger: false },
  { label: "Shell — Database",             desc: "Console PostgreSQL interactive", cmd: "docker compose exec db psql -U ${POSTGRES_USER:-optician} -d ${POSTGRES_DB:-optician}", danger: false },
  { sep: true },
  { label: "Clean — Reset complet",        desc: "⚠ Supprime containers + volumes (BDD perdue !)", cmd: "docker compose down -v && docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v 2>/dev/null || true", danger: true },
  { label: "Rebuild from scratch",         desc: "⚠ Reset total + rebuild production", cmd: "docker compose down -v && docker compose up --build -d", danger: true },
];

const items = cmds.filter(c => !c.sep);
let cur = 0;
let totalLines = 0;
let firstRender = true;

function buildOutput() {
  const sel = items[cur];
  const lines = [];

  lines.push("");
  lines.push(`  ${C}${B}🐳 OPTICIAN CMS — Docker Manager${R}`);
  lines.push("");

  for (const c of cmds) {
    if (c.sep) { lines.push(`  ${D}──────────────────────────────────────${R}`); continue; }
    const idx = items.indexOf(c);
    if (idx === cur) {
      const clr = c.danger ? RD : W;
      lines.push(`  ${clr}${B}▸ ${c.label}${R}`);
    } else {
      const clr = c.danger ? `${D}${RD}` : D;
      lines.push(`  ${clr}  ${c.label}${R}`);
    }
  }

  lines.push("");
  lines.push(`  ${W}${B}${sel.label}${R}`);
  lines.push(`  ${D}${sel.desc}${R}`);
  const cmdShort = sel.cmd.length > 55 ? sel.cmd.slice(0, 52) + "..." : sel.cmd;
  lines.push(`  ${M}$${R} ${D}${cmdShort}${R}`);
  lines.push("");
  lines.push(`  ${D}↑↓ naviguer  ·  enter exécuter  ·  q quitter${R}`);
  lines.push("");

  return lines;
}

function render() {
  const lines = buildOutput();

  if (!firstRender && totalLines > 0) {
    process.stdout.write(UP(totalLines));
  }
  firstRender = false;

  for (const l of lines) {
    process.stdout.write(`${EL}${l}\n`);
  }

  totalLines = lines.length;
}

function quit(msg) {
  // Erase our UI
  if (totalLines > 0) {
    process.stdout.write(UP(totalLines));
    for (let i = 0; i < totalLines; i++) process.stdout.write(`${EL}\n`);
    process.stdout.write(UP(totalLines));
  }
  process.stdout.write(SC);
  if (msg) console.log(`  ${D}${msg}${R}`);
  process.stdin.setRawMode?.(false);
  process.stdin.removeAllListeners("data");
  process.exit(0);
}

async function run(item) {
  // Erase UI
  if (totalLines > 0) {
    process.stdout.write(UP(totalLines));
    for (let i = 0; i < totalLines; i++) process.stdout.write(`${EL}\n`);
    process.stdout.write(UP(totalLines));
  }
  process.stdout.write(SC);
  process.stdin.setRawMode(false);

  console.log("");
  console.log(`  ${W}${B}${item.label}${R}`);
  console.log(`  ${M}$${R} ${D}${item.cmd}${R}`);

  const prompt = item.danger
    ? `\n  ${RD}${B}⚠ DESTRUCTIF${R} ${Y}Confirmer ? (o/N)${R} `
    : `\n  ${Y}Exécuter ? (o/N)${R} `;

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ok = await new Promise(r => rl.question(prompt, a => { rl.close(); const v = a.trim().toLowerCase(); r(v === "o" || v === "oui" || v === "y" || v === "yes"); }));

  if (!ok) { console.log(`\n  ${D}Annulé.${R}\n`); process.exit(0); }

  console.log(`\n  ${G}${B}▶ Exécution...${R}\n`);

  try { execSync(item.cmd, { stdio: "inherit", shell: true }); }
  catch { /* Ctrl+C on logs etc */ }

  console.log(`\n  ${G}${B}✓ Terminé.${R}\n`);
  process.exit(0);
}

// ── Main
if (!process.stdin.isTTY) { console.error("Terminal interactif requis."); process.exit(1); }

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdout.write(HC);
process.on("exit", () => process.stdout.write(SC));

render();

process.stdin.on("data", key => {
  if (key === "\u0003" || key === "q" || key === "Q") return quit("Au revoir.");
  if (key === "\u001b[A" || key === "k") { cur = (cur - 1 + items.length) % items.length; render(); }
  if (key === "\u001b[B" || key === "j") { cur = (cur + 1) % items.length; render(); }
  if (key === "\r" || key === "\n") {
    process.stdin.removeAllListeners("data");
    process.stdin.setRawMode(false);
    run(items[cur]);
  }
});
