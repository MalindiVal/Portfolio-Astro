// Indique s'il faut reconstruire le site : un commit a-t-il été poussé sur la branche principale
// d'un dépôt public depuis le dernier déploiement ?
//
// Utilisé par .github/workflows/surveillance-depots.yml ; se lance aussi en local :
//   node scripts/depots-modifies.mjs
//
// - Activité : flux public des événements du compte (PushEvent), une seule requête.
// - Dernier déploiement : dernière exécution du workflow astro.yml, quel que soit son résultat
//   (sauf annulée) : un build en échec n'est pas relancé tous les quarts d'heure.
// - Les push sur ce dépôt-ci sont ignorés : ils lancent déjà le déploiement.
//
// Écrit `build=true|false` dans $GITHUB_OUTPUT (et l'affiche).
// Pour tester : DEPUIS=2026-11-01T00:00:00Z remplace la date du dernier déploiement.

import { appendFileSync } from "node:fs";

const USER = process.env.GITHUB_USER ?? "MalindiVal";
const SELF = process.env.GITHUB_REPOSITORY ?? `${USER}/Portfolio-Astro`;
const DEPLOY_WORKFLOW = "astro.yml";

async function github(path) {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`GitHub ${res.status} sur ${path}`);
  return res.json();
}

function output(build, reason) {
  console.log(`${reason}\nbuild=${build}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `build=${build}\n`);
}

const [runs, repos, events] = await Promise.all([
  github(`/repos/${SELF}/actions/workflows/${DEPLOY_WORKFLOW}/runs?per_page=30`),
  github(`/users/${USER}/repos?type=owner&per_page=100`),
  github(`/users/${USER}/events/public?per_page=100`),
]);

// Dernière tentative de déploiement (réussie, en échec, en cours ou en attente ; pas annulée)
const lastDeploy = process.env.DEPUIS
  ? new Date(process.env.DEPUIS)
  : runs.workflow_runs
      .filter((run) => run.conclusion !== "cancelled")
      .map((run) => new Date(run.created_at))
      .sort((a, b) => b - a)[0];

const defaultBranch = new Map(repos.map((repo) => [repo.full_name.toLowerCase(), repo.default_branch]));

const pushes = events.filter((event) => {
  if (event.type !== "PushEvent") return false;
  const repo = event.repo.name.toLowerCase();
  if (repo === SELF.toLowerCase()) return false;
  const branch = defaultBranch.get(repo);
  return branch !== undefined && event.payload?.ref === `refs/heads/${branch}`;
});

const fresh = lastDeploy ? pushes.filter((event) => new Date(event.created_at) > lastDeploy) : pushes;

if (!lastDeploy) {
  output(true, "Aucun déploiement trouvé : reconstruction.");
} else if (fresh.length > 0) {
  const list = [...new Set(fresh.map((event) => event.repo.name))].join(", ");
  output(true, `Dernier déploiement : ${lastDeploy.toISOString()}. Nouveaux commits sur : ${list}.`);
} else {
  output(false, `Dernier déploiement : ${lastDeploy.toISOString()}. Aucun nouveau commit sur une branche principale.`);
}
