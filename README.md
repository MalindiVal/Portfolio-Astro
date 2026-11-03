# Portfolio — Valentin Malindi

Portfolio personnel de **Valentin Malindi**, titulaire d’un BUT Informatique (parcours Réalisation d’applications) et étudiant en cycle ingénieur informatique à l’ESEO Dijon, à la recherche d’une **alternance de 3 ans**.

🌐 **Site en ligne :** https://malindival.github.io/Portfolio-Astro

## Contenu

| Page | Description |
| :--- | :--- |
| **Accueil** | Présentation, recherche d’alternance, à propos, projets récents, parcours et compétences |
| **Projets** | Projets réalisés en formation et en autonomie (AutomateDesign, TaskStep, RapportStage…) |
| **Stages** | Expériences en entreprise : EssilorLuxottica, La Salle Passy - Buzenval, Centre Hospitalier d’Auxerre |
| **Formation** | Parcours scolaire, compétences du BUT Informatique et langues |
| **CV** | CV intégré depuis Canva, toujours à jour |

## Technologies

- [Astro 5](https://astro.build) — site statique, sans framework JavaScript côté client
- [Tailwind CSS 4](https://tailwindcss.com) via le plugin `@tailwindcss/vite`
- Déploiement automatique sur **GitHub Pages** avec GitHub Actions

## Lancer le projet

Prérequis : **Node.js 20** ou plus récent.

```bash
npm ci            # installer les dépendances
npm run dev       # serveur de dev sur http://localhost:4321/Portfolio-Astro/
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
```

## Structure

```text
src/
├── layouts/Layout.astro      # <head>, Header, Contact, Footer et animations
├── styles/global.css         # Tailwind, thème et animations
├── pages/                    # une page = une route (index, projects, stages, formation, cv)
└── components/
    ├── Header.astro          # navigation et menu mobile
    ├── Contact.astro, Footer.astro, Canva.astro
    ├── index/                # sections de l’accueil
    └── projects/, stages/, formation/
public/                       # images, icônes, photo de profil
```

## Déploiement

Le site est servi sous le sous-chemin `/Portfolio-Astro` (`base` dans `astro.config.mjs`) : les liens internes et les fichiers de `public/` sont donc toujours préfixés par `import.meta.env.BASE_URL`.

Chaque push sur `main` déclenche le workflow [`.github/workflows/astro.yml`](.github/workflows/astro.yml), qui construit le site et le publie sur GitHub Pages. Les modifications passent par une branche et une pull request.

Les conventions de code et de style sont détaillées dans [`AGENTS.md`](AGENTS.md).

## Contact

- [LinkedIn](https://www.linkedin.com/in/valentin-malindi-0372a2253/)
- [GitHub](https://github.com/MalindiVal)
- [Portfolio Mahara](https://iutdijon.u-bourgogne.fr/mahara/user/view.php?profile=valentinmalindi)
