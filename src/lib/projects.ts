// Assemble la liste des projets au build : données de src/data/projects.ts + activité GitHub.
//
// - Chaque projet est daté par le push le plus récent parmi ses dépôts, puis la liste est triée
//   du plus récent au plus ancien.
// - Les dépôts publics portant le topic PORTFOLIO_TOPIC qui ne sont pas encore décrits sont ajoutés.
// - Si GitHub est injoignable (hors ligne, limite d'API atteinte…), le build ne casse pas :
//   les projets décrits à la main sont affichés dans l'ordre du fichier, sans date.
//
// GITHUB_TOKEN (facultatif, fourni par GitHub Actions) relève la limite de l'API de 60 à 1 000 requêtes/h.

import { FEATURED_COUNT, GITHUB_USER, PORTFOLIO_TOPIC, RECENT_DAYS, projects as curated, type ProjectData } from "../data/projects";

export type Project = ProjectData & {
  /** Date du dernier push sur l'un des dépôts du projet (null si inconnue). */
  updatedAt: Date | null;
  recent: boolean;
};

type GitHubRepo = {
  full_name: string;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

/** Langage GitHub → icône de public/icons/ pour les projets ajoutés automatiquement. */
const LANGUAGE_ICONS: Record<string, string> = {
  Go: "go.svg",
  Python: "python.svg",
  "C#": "csharp.svg",
  TypeScript: "typescript.svg",
  JavaScript: "javascript.svg",
  PHP: "php.svg",
  Lua: "lua.svg",
  HTML: "html5.svg",
  CSS: "css3.svg",
  PowerShell: "powershell.svg",
};

async function githubGet<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`GitHub ${res.status} sur ${path}`);
  return res.json() as Promise<T>;
}

async function fetchRepos(): Promise<Map<string, GitHubRepo>> {
  const owned = await githubGet<GitHubRepo[]>(`/users/${GITHUB_USER}/repos?type=owner&per_page=100&sort=pushed`);
  const repos = new Map(owned.map((r) => [r.full_name.toLowerCase(), r]));

  // Dépôts cités dans les données mais hors du compte (organisation, autre propriétaire)
  const missing = [...new Set(curated.flatMap((p) => p.repos))].filter((r) => !repos.has(r.toLowerCase()));
  const extra = await Promise.allSettled(missing.map((r) => githubGet<GitHubRepo>(`/repos/${r}`)));
  for (const result of extra) {
    if (result.status === "fulfilled") repos.set(result.value.full_name.toLowerCase(), result.value);
  }
  return repos;
}

function fromRepo(repo: GitHubRepo): ProjectData {
  const topics = (repo.topics ?? []).filter((t) => t !== PORTFOLIO_TOPIC);
  const icon = repo.language ? LANGUAGE_ICONS[repo.language] : undefined;
  return {
    title: repo.name,
    repos: [repo.full_name],
    description: repo.description ?? "",
    tags: [...new Set([...(repo.language ? [repo.language] : []), ...topics])],
    links: [{ label: "Voir le projet sur Github", href: repo.html_url }],
    icons: icon ? [icon] : [],
  };
}

async function build(): Promise<Project[]> {
  let repos: Map<string, GitHubRepo>;
  try {
    repos = await fetchRepos();
  } catch (error) {
    console.warn(`[projets] GitHub injoignable, projets affichés sans date : ${(error as Error).message}`);
    return curated.map((p) => ({ ...p, updatedAt: null, recent: false }));
  }

  const known = new Set(curated.flatMap((p) => p.repos.map((r) => r.toLowerCase())));
  const discovered = [...repos.values()]
    .filter((r) => !r.fork && !r.archived && r.topics?.includes(PORTFOLIO_TOPIC) && !known.has(r.full_name.toLowerCase()))
    .map(fromRepo);

  const now = Date.now();
  const all = [...curated, ...discovered].map((p): Project => {
    const dates = p.repos
      .map((r) => repos.get(r.toLowerCase())?.pushed_at)
      .filter((d): d is string => Boolean(d))
      .map((d) => new Date(d).getTime());
    const updatedAt = dates.length ? new Date(Math.max(...dates)) : null;
    const recent = p.highlight !== false && updatedAt !== null && now - updatedAt.getTime() < RECENT_DAYS * 86_400_000;
    return { ...p, updatedAt, recent };
  });

  // Tri stable : les projets sans date gardent leur ordre, après les projets datés
  return all.sort((a, b) => (b.updatedAt?.getTime() ?? -Infinity) - (a.updatedAt?.getTime() ?? -Infinity));
}

// Un seul appel à GitHub par build (et par lancement de `npm run dev`)
let cache: Promise<Project[]> | undefined;

export function getProjects(): Promise<Project[]> {
  return (cache ??= build());
}

/** Projets mis en avant sur l'accueil : les plus récents, hors projets marqués `highlight: false`. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const list = await getProjects();
  return list.filter((p) => p.highlight !== false).slice(0, FEATURED_COUNT);
}

const monthYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** « novembre 2026 » */
export function formatMonth(date: Date): string {
  return monthYear.format(date);
}
