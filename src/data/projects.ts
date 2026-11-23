// Projets présentés sur le site.
//
// - L'ordre d'affichage est calculé au build à partir du dernier push sur les dépôts de `repos`
//   (voir src/lib/projects.ts) : l'ordre de ce tableau ne sert que si GitHub est injoignable.
// - Un dépôt public de GITHUB_USER qui porte le topic `portfolio` et qui n'est cité dans aucun
//   `repos` ci-dessous est ajouté automatiquement avec sa description, sa langue et ses topics GitHub.
//   Pour personnaliser un projet ajouté ainsi (texte, image, liens), le décrire ici.

export const GITHUB_USER = "MalindiVal";

/** Topic GitHub qui ajoute automatiquement un dépôt au portfolio. */
export const PORTFOLIO_TOPIC = "portfolio";

/** Un projet poussé il y a moins de RECENT_DAYS jours reçoit le badge « Récent ». */
export const RECENT_DAYS = 90;

/** Nombre de projets récents mis en avant sur la page d'accueil. */
export const FEATURED_COUNT = 2;

export type ProjectData = {
  title: string;
  /** Dépôts « propriétaire/nom » utilisés pour dater le projet. */
  repos: string[];
  description: string;
  /** Texte court pour la page d'accueil (sinon `description`). */
  summary?: string;
  tags: string[];
  links: { label: string; href: string }[];
  /** Image dans public/ ; sans image, la carte affiche les icônes de `icons` (public/icons/*.svg). */
  image?: { src: string; width: number; height: number };
  icons?: string[];
  /** false : jamais de badge « Récent » ni de mise en avant sur l'accueil (ex. ce portfolio, poussé en continu). */
  highlight?: boolean;
};

export const projects: ProjectData[] = [
  {
    title: "Go-Quick-Actu",
    repos: ["MalindiVal/Go-Quick-Actu"],
    icons: ["go.svg", "docker.svg"],
    description:
      "API REST en Go qui agrège l'actualité de 10 médias français par flux RSS, analyse chaque article avec l'IA (mots-clés et sujet) et produit des synthèses multi-sources : les faits communs, puis l'angle choisi par chaque média.",
    summary:
      "API REST en Go qui agrège l’actualité de 10 médias français, analyse chaque article avec l’IA et produit des synthèses multi-sources.",
    tags: ["Go", "Gin", "PostgreSQL", "RSS", "API Claude", "Docker", "GitHub Actions"],
    links: [{ label: "Voir le projet sur Github", href: "https://github.com/MalindiVal/Go-Quick-Actu" }],
  },
  {
    title: "JobRadar",
    repos: ["MalindiVal/jobradar-backend", "MalindiVal/jobradar-frontend", "MalindiVal/jobradar-angular"],
    icons: ["python.svg", "fastapi.svg", "nextjs.svg"],
    description:
      "Application de veille d'offres d'alternance : collecte automatisée avec n8n, analyse et score de chaque offre par Claude (avec un repli sur un score par règles), notifications par e-mail et tableau de bord web.",
    summary:
      "Veille d’offres d’alternance : collecte automatisée avec n8n, analyse des offres par Claude, notifications par e-mail et tableau de bord web.",
    tags: ["Python", "FastAPI", "PostgreSQL", "n8n", "API Claude", "Next.js", "Angular", "Docker"],
    links: [
      { label: "API sur Github", href: "https://github.com/MalindiVal/jobradar-backend" },
      { label: "Client Next.js", href: "https://github.com/MalindiVal/jobradar-frontend" },
      { label: "Client Angular", href: "https://github.com/MalindiVal/jobradar-angular" },
    ],
  },
  {
    title: "AutomateDesign",
    repos: ["MalindiVal/AutomateDesign-API", "MalindiVal/AutomateDesign-Client", "MalindiVal/AutomateDesign-ReactClient"],
    image: { src: "automatedesign.webp", width: 1200, height: 726 },
    description:
      "Une application de bureau WPF qui permet de réaliser des schémas d'automates. Ce logiciel est connecté à une API qui regroupe les automates créés par les différents utilisateurs connectés. Réalisé dans le cadre d'un projet universitaire.",
    summary:
      "Outil de création de schémas d’automates en WPF, connecté à une API ASP.NET pour enregistrer et partager ses automates.",
    tags: ["C#", "WPF", "XAML", "API REST", "SQLite", "Docker", "MVVM"],
    links: [
      { label: "Page mahara", href: "https://iutdijon.u-bourgogne.fr/mahara/view/view.php?homepage=equipe-sae-s5-01&page=sae-5-automatedesign" },
      { label: "Client React", href: "https://github.com/MalindiVal/AutomateDesign-ReactClient" },
      { label: "Client WPF", href: "https://github.com/MalindiVal/AutomateDesign-Client" },
      { label: "API", href: "https://github.com/MalindiVal/AutomateDesign-API" },
    ],
  },
  {
    title: "Gestionnaire de Droits en Go",
    repos: ["MalindiVal/GUI-Golang-Gestion-Droits"],
    image: { src: "Unyonetnosetablissement.jpg", width: 259, height: 194 },
    description:
      "Application console en Go permettant de gérer les droits des utilisateurs à partir d'un fichier XML. Permet de faciliter la gestion des droits dans un environnement hospitalier.",
    tags: ["Go", "XML"],
    links: [{ label: "Voir le projet sur Github", href: "https://github.com/MalindiVal/GUI-Golang-Gestion-Droits" }],
  },
  {
    title: "TaskStep",
    repos: ["MalindiVal/S4_B1_TechnoLab_Taskstep"],
    image: { src: "taskstep.webp", width: 1200, height: 456 },
    description:
      "Application web permettant de gérer des tâches. Ceci est une version améliorée d'une application précédente, avec une interface plus moderne et des corrections en termes de code. Réalisé dans le cadre d'un projet universitaire.",
    tags: ["PHP", "XAMPP", "Audit", "Optimisation"],
    links: [
      { label: "Page mahara", href: "https://iutdijon.u-bourgogne.fr/mahara/view/view.php?profile=valentinmalindi&page=sae-4-01-developpement-d-une-application-complexe" },
      { label: "Voir le projet sur Github", href: "https://github.com/MalindiVal/S4_B1_TechnoLab_Taskstep" },
    ],
  },
  {
    title: "SRB2 Kart Turbo Mod",
    repos: ["MalindiVal/SRB2Kart-Turbo-Mode"],
    image: { src: "srb2k.webp", width: 1200, height: 750 },
    description:
      "Un mod pour le jeu SRB2 Kart, ajoutant de nouvelles fonctionnalités et améliorations au gameplay. Ce mod vise à enrichir l'expérience de jeu pour les joueurs de SRB2 Kart.",
    tags: ["Lua"],
    links: [{ label: "Voir le projet sur Github", href: "https://github.com/MalindiVal/SRB2Kart-Turbo-Mode" }],
  },
  {
    title: "RapportStage",
    repos: ["MalindiVal/RapportIUT-API", "MalindiVal/RapportIUT-Client"],
    image: { src: "RapportStage.webp", width: 1200, height: 512 },
    description:
      "Une application Web qui permet de déposer et de consulter des rapports de stage. Cette application facilite la gestion et l'accès aux rapports de stage pour les étudiants et les enseignants. Réalisé dans le cadre d'un projet universitaire.",
    summary: "Application web de dépôt et de consultation des rapports de stage pour les étudiants et les enseignants.",
    tags: ["ASP.NET", "C#", "HTML/CSS/JS", "Docker"],
    links: [
      { label: "Page mahara", href: "https://iutdijon.u-bourgogne.fr/mahara/view/view.php?profile=valentinmalindi&page=sae-3-01-developpement-d-une-application" },
      { label: "API sur Github", href: "https://github.com/MalindiVal/RapportIUT-API" },
      { label: "Client sur Github", href: "https://github.com/MalindiVal/RapportIUT-Client" },
    ],
  },
  {
    title: "Portfolio",
    repos: ["MalindiVal/Portfolio-Astro"],
    highlight: false,
    image: { src: "portfolio.webp", width: 1200, height: 638 },
    description:
      "Le site que vous consultez : un site statique réalisé avec Astro et Tailwind CSS, responsive et animé dans le respect des préférences d'accessibilité. Il est construit et déployé automatiquement sur GitHub Pages par un workflow GitHub Actions à chaque mise à jour.",
    tags: ["Astro", "Tailwind CSS", "TypeScript", "GitHub Actions", "CI/CD"],
    links: [{ label: "Voir le projet sur Github", href: "https://github.com/MalindiVal/Portfolio-Astro" }],
  },
];
