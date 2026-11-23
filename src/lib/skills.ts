// Langages de la section Compétences, calculés au build d'après les dépôts GitHub.
//
// - Un langage compte pour un dépôt s'il y représente au moins MIN_SHARE du code.
// - La liste est triée par nombre de dépôts, puis par quantité de code.
// - Les langages saisis à la main sans dépôt public (ex. PowerShell) restent affichés, à la fin.
// - Si GitHub est injoignable, la liste saisie à la main est affichée telle quelle.

import { LANGUAGE_ICONS, getReposLanguages } from "./github";

export type Skill = { name: string; icon?: string; rounded?: boolean };
export type LanguageSkill = Skill & { repos: number };

/** Part minimale du code d'un dépôt pour qu'un langage y soit compté. */
const MIN_SHARE = 0.05;

/**
 * Langages GitHub à ne pas afficher dans « Langages » : fichiers de configuration, gabarits…,
 * et Astro, déjà présenté dans « Frameworks ».
 */
const IGNORED = new Set(["Dockerfile", "Shell", "Batchfile", "Makefile", "CMake", "Procfile", "Mako", "Hack", "Astro"]);

let cache: Promise<LanguageSkill[]> | undefined;

export function getLanguages(manual: Skill[]): Promise<LanguageSkill[]> {
  return (cache ??= build(manual));
}

async function build(manual: Skill[]): Promise<LanguageSkill[]> {
  let repos: Awaited<ReturnType<typeof getReposLanguages>>;
  try {
    repos = await getReposLanguages();
  } catch (error) {
    console.warn(`[compétences] GitHub injoignable, langages saisis à la main : ${(error as Error).message}`);
    return manual.map((skill) => ({ ...skill, repos: 0 }));
  }

  const stats = new Map<string, { repos: number; bytes: number }>();
  for (const { bytes } of repos) {
    const total = Object.values(bytes).reduce((a, b) => a + b, 0);
    for (const [language, size] of Object.entries(bytes)) {
      if (IGNORED.has(language) || size / total < MIN_SHARE) continue;
      const stat = stats.get(language) ?? { repos: 0, bytes: 0 };
      stat.repos += 1;
      stat.bytes += size;
      stats.set(language, stat);
    }
  }

  const byName = new Map(manual.map((skill) => [skill.name.toLowerCase(), skill]));
  const detected = [...stats.entries()]
    .sort(([, a], [, b]) => b.repos - a.repos || b.bytes - a.bytes)
    .map(([name, stat]): LanguageSkill => {
      const known = byName.get(name.toLowerCase());
      const icon = LANGUAGE_ICONS[name]?.replace(/\.svg$/, "");
      return { ...(known ?? { name, icon }), repos: stat.repos };
    });

  const seen = new Set(detected.map((skill) => skill.name.toLowerCase()));
  const manualOnly = manual.filter((skill) => !seen.has(skill.name.toLowerCase())).map((skill) => ({ ...skill, repos: 0 }));

  return [...detected, ...manualOnly];
}
