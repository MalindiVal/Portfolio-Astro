# AGENTS.md

Instructions pour les agents IA (Claude Code, Codex, Copilot…) qui travaillent sur ce dépôt.

## Le projet

Portfolio personnel de **Valentin Malindi**, titulaire d’un BUT Informatique (parcours Réalisation d’applications) et étudiant en cycle ingénieur à l’ESEO Dijon, en recherche d’alternance.

- Site statique **Astro 5** + **Tailwind CSS 4** (plugin `@tailwindcss/vite`), sans framework JS côté client.
- Déployé sur **GitHub Pages** : https://malindival.github.io/Portfolio-Astro
- Tout le contenu du site est **en français**.

## Commandes

```bash
npm ci            # installer les dépendances
npm run dev       # serveur de dev sur http://localhost:4321/Portfolio-Astro/
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
```

Il n’y a ni tests ni linter : **`npm run build` doit passer** avant chaque commit.

## Structure

```text
src/
├── layouts/Layout.astro      # <head>, Header, <main>, Contact, Footer + script des animations
├── styles/global.css         # Tailwind, thème (police Inter), animations
├── pages/                    # une page = une route
│   ├── index.astro           # accueil : assemble les sections de components/index/
│   ├── projects.astro, stages.astro, formation.astro, cv.astro
├── components/
│   ├── Header.astro          # navigation (liste navItems) + menu mobile
│   ├── Contact.astro, Footer.astro, Canva.astro (CV Canva intégré)
│   ├── index/                # sections de l’accueil (Hero, Alternance, About, Projets, ProXP, Skills)
│   ├── projects/, stages/, formation/
public/                       # images, icônes (public/icons/*.svg), CV PDF, photo de profil
```

`src/components/Welcome.astro` est un reste du template Astro, il n’est pas utilisé.

## Conventions

### Chemins et liens
- Le site est servi sous le sous-chemin `/Portfolio-Astro` (`base` dans `astro.config.mjs`).
- **Toujours** préfixer les liens internes et les fichiers de `public/` avec `import.meta.env.BASE_URL` :
  ```astro
  ---
  const base = import.meta.env.BASE_URL;
  ---
  <a href={`${base}/projects`}>…</a>
  <img src={`${base}/profil.jpg`} alt="…" />
  ```
  Jamais de chemin absolu en dur (`/images/…`) ni de chemin relatif (`photo.jpg`).

### Pages et layout
- Une nouvelle page utilise seulement `<Layout title="Titre | Valentin Malindi">…</Layout>` : le Layout ajoute déjà Header, Contact et Footer.
- Une page = un seul `<h1>` ; les sections utilisent `<h2>`, les cartes `<h3>`.
- Ajouter toute nouvelle page à `navItems` dans `Header.astro`.

### Style (Tailwind 4)
- Thème sombre : fond `bg-gray-950`, sections alternées en `bg-gray-900`, cartes `bg-gray-900` (ou `bg-gray-950` sur une section `bg-gray-900`), `rounded-xl shadow-lg`.
- Couleur d’accent : **emerald** (`text-emerald-400`, `bg-emerald-500`). Titres de section : `text-3xl font-bold text-emerald-400 text-center`.
- Bouton principal : `bg-emerald-500 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition`.
- Conteneurs : `max-w-6xl mx-auto` (ou `max-w-4xl` pour les frises), marges `px-4`/`px-6`.
- Les styles globaux de `global.css` doivent rester dans `@layer base` : du CSS hors couche écrase les classes utilitaires de Tailwind 4.
- Le site doit rester lisible à 375 px de large, sans défilement horizontal.

### Animations
- `data-reveal` sur un élément : apparition en fondu au défilement (IntersectionObserver dans `Layout.astro`). Décaler les cartes d’une grille avec `style={`--reveal-delay: ${i * 120}ms`}`.
- `card-hover` : légère élévation au survol des cartes.
- `animate-fade-up` (+ `--delay`) : animation d’entrée au chargement, réservée au hero.
- Toute nouvelle animation doit être désactivée dans le bloc `@media (prefers-reduced-motion: reduce)` de `global.css`, et le contenu doit rester visible sans JavaScript.

### Contenu
- Les listes répétitives (compétences, orientations, cursus…) sont décrites dans un tableau dans le frontmatter et rendues avec `.map()`.
- Ne jamais inventer d’informations (dates, entreprises, diplômes, compétences) : s’appuyer sur le contenu existant ou demander à Valentin.

## Git

- Messages de commit **en français**, avec un titre court (« Ajout de… », « Mise à jour de… », « Correction de… ») et une liste à puces des changements si nécessaire.
- Le déploiement sur GitHub Pages se lance automatiquement à chaque push sur `main` (`.github/workflows/astro.yml`) : passer par une branche et une pull request.
