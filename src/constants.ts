import {
  Project,
  Education,
  SkillGroup,
  Experience,
  ContentWork,
} from "./types";

export const CV_URL =
  "https://drive.google.com/file/d/1-example-cv-id/view?usp=sharing";

export const EXPERIENCES: Experience[] = [
  {
    id: "1",
    title: "Stagiaire Développeur Full Stack & Designer UI/UX",
    company: "Orange digital Center Mali",
    period: "3 Mois",
    description:
      "Contribution à l’élaboration du cahier des charges, création des maquettes complètes du site, de l’application web et mobile d’ECOTADJI.",
  },
  {
    id: "2",
    title: "Designer/Graphiste et CM",
    company: "KAMS CONSULTING",
    period: "3 Mois",
    description:
      "Création de contenus visuels et gestion des réseaux sociaux pour renforcer l’image et la visibilité digitale de l’entreprise et de ses clients.",
  },
];

export const CONTENT_WORKS: ContentWork[] = [
  {
    id: "c1",
    title: "Affiche Événementielle Orange",
    category: "Graphic Design",
    imageUrl: "https://picsum.photos/seed/poster1/800/1000",
    description: "Conception d'une affiche pour un événement digital.",
  },
  {
    id: "c2",
    title: "Identité Visuelle KAMS",
    category: "Branding",
    imageUrl: "https://picsum.photos/seed/branding1/800/1000",
    description: "Charte graphique et supports de communication.",
  },
  {
    id: "c3",
    title: "UI Design Mobile App",
    category: "UI/UX",
    imageUrl: "https://picsum.photos/seed/ui1/800/1000",
    description: "Maquettes haute fidélité pour application mobile.",
  },
  {
    id: "c4",
    title: "Flyer Promotionnel",
    category: "Print",
    imageUrl: "https://picsum.photos/seed/flyer1/800/1000",
    description: "Design de supports de communication print.",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Ikaso - Réservation d’Hébergement",
    category: "Mobile App",
    description:
      "Application complète de réservation d’hébergements intégrant un système client, hôte et dashboard.",
    problem:
      "Difficulté de centraliser les offres d'hébergement et de gérer les réservations en temps réel.",
    solution:
      "Utilisation de Flutter pour le front-end et Firebase pour le back-end et la base de données.",
    stack: ["Flutter", "Firebase", "Dart"],
    results: "Projet personnel réalisé en Octobre 2024.",
    imageUrl: "https://picsum.photos/seed/ikaso/1200/800",
  },
  {
    id: "2",
    title: "Gest Event - Gestion d’Événements",
    category: "Web Platform",
    description:
      "Plateforme pour la réservation, le suivi des événements et la gestion des utilisateurs.",
    problem:
      "Manque d'outils intégrés pour la gestion fluide d'événements à Orange Digital Kalanso.",
    solution:
      "Architecture Angular (front-end), Spring Boot (back-end) et MySQL (base de données).",
    stack: ["Angular", "Spring Boot", "MySQL", "Java"],
    results: "Développé en Juin 2024 @ Orange Digital Kalanso.",
    imageUrl: "https://picsum.photos/seed/gestevent/1200/800",
  },
  {
    id: "3",
    title: "Design UI/UX & Prototypage",
    category: "UI/UX Design",
    description:
      "Création de maquettes interactives et de prototypes fonctionnels pour des plateformes complexes.",
    problem:
      "Nécessité d'interfaces intuitives adaptées aux besoins des utilisateurs finaux.",
    solution:
      "Conception sous Figma avec focus sur l'ergonomie et le parcours utilisateur.",
    stack: ["Figma", "Prototypage", "UX Research"],
    results: "Réalisé en Juin 2024.",
    imageUrl: "https://picsum.photos/seed/figma-design/1200/800",
  },
];

export const EDUCATION: Education[] = [
  {
    id: "1",
    title: "Classe préparatoire Mastère",
    institution: "DIGITAL CAMPUS Paris",
    period: "En cours",
    skills: ["Stratégie Digitale", "Expertise Web"],
    technologies: ["Marketing Digital", "Management"],
    methodologies: ["Agile", "Stratégie"],
  },
  {
    id: "2",
    title: "BootCamp développement Full-stack",
    institution: "Orange Digital Center Bamako",
    period: "2024 (6 Mois)",
    skills: ["Développement Web", "Mobile", "Full Stack"],
    technologies: ["React Js", "Node.js", "Spring Boot"],
    methodologies: ["Git", "Agile"],
  },
  {
    id: "3",
    title: "DUT en Informatique de Gestion",
    institution: "INTEC-SUP Bamako-Mali",
    period: "2021 - 2022",
    skills: ["Informatique de Gestion", "Bases de données"],
    technologies: ["Java", "SQL", "PHP"],
    methodologies: ["UML", "Merise"],
  },
  {
    id: "4",
    title: "Baccalauréat en science Expérimentale",
    institution: "Lycée Kadidjah, Bamako-Mali",
    period: "2019 - 2020",
    skills: ["Sciences", "Mathématiques"],
    technologies: [],
    methodologies: [],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    title: "Développement",
    skills: [
      {
        name: "HTML/CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "Angular",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
      },
      {
        name: "Flutter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      },
      {
        name: "React Js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Java/JEE",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
      {
        name: "Spring Boot",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
      },
    ],
  },
  {
    title: "Design & Audio-visuel",
    skills: [
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Photoshop",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
      },
      {
        name: "Illustrator",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
      },
      {
        name: "Premiere Pro",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg",
      },
      {
        name: "CapCut",
        icon: "https://www.vectorlogo.zone/logos/capcut/capcut-icon.svg",
      },
      {
        name: "Canva",
        icon: "https://www.vectorlogo.zone/logos/canva/canva-icon.svg",
      },
    ],
  },
  {
    title: "Outils & Méthodes",
    skills: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      },
      {
        name: "IA Tools",
        icon: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
      },
      {
        name: "Agile",
        icon: "https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg",
      },
      {
        name: "Trello",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",
      },
    ],
  },
];
