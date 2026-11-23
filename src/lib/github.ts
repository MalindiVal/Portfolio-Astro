// Accès à l'API GitHub au moment du build, partagé par les projets et les compétences.
//
// Chaque requête n'est faite qu'une fois par build (et par lancement de `npm run dev`).
// GITHUB_TOKEN (facultatif, fourni par GitHub Actions) relève la limite de l'API de 60 à 1 000 requêtes/h.

import { GITHUB_USER } from "../data/projects";

export type GitHubRepo = {
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

/** Langage GitHub → icône de public/icons/. */
export const LANGUAGE_ICONS: Record<string, string> = {
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

export async function githubGet<T>(path: string): Promise<T> {
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

let ownedRepos: Promise<GitHubRepo[]> | undefined;

/** Dépôts publics dont GITHUB_USER est propriétaire. */
export function getOwnedRepos(): Promise<GitHubRepo[]> {
  return (ownedRepos ??= githubGet<GitHubRepo[]>(`/users/${GITHUB_USER}/repos?type=owner&per_page=100&sort=pushed`));
}

let languages: Promise<{ repo: GitHubRepo; bytes: Record<string, number> }[]> | undefined;

/** Langages de chaque dépôt (hors forks), en octets de code par langage. */
export function getReposLanguages() {
  return (languages ??= getOwnedRepos().then((repos) =>
    Promise.all(
      repos
        .filter((repo) => !repo.fork)
        .map(async (repo) => ({ repo, bytes: await githubGet<Record<string, number>>(`/repos/${repo.full_name}/languages`) })),
    ),
  ));
}
