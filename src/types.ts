export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  stack: string[];
  results: string;
  imageUrl: string;
  link?: string;
  githubUrl?: string;
  figmaUrl?: string;
}

export interface Settings {
  name: string;
  profileImageUrl: string;
  bio?: string;
}

export interface Education {
  id: string;
  title: string;
  institution: string;
  period: string;
  skills: string[];
  technologies: string[];
  methodologies: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface ContentWork {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
}

export interface SkillGroup {
  title: string;
  skills: { name: string; icon?: string }[];
}
