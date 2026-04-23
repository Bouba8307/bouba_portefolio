import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Code,
  Palette,
  BarChart3,
  ExternalLink,
  ChevronDown,
  Globe,
  Smartphone,
  Layout,
  Layers,
  Zap,
  CheckCircle2,
  Home,
  Briefcase,
  User,
  MessageSquare,
  Monitor,
  Download,
} from "lucide-react";
import {
  PROJECTS,
  EDUCATION,
  SKILLS,
  EXPERIENCES,
  CONTENT_WORKS,
  CV_URL,
} from "./constants";
import { Section, Button, Badge, Modal } from "./components/UI";
import {
  ProjectCard,
  TimelineItem,
  ExperienceItem,
  ContentCard,
} from "./components/Cards";
import type { User as AuthUser } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./services/supabase";
import {
  fetchAllRows,
  fetchLatestSettings,
  insertRow,
} from "./services/supabaseDb";
import {
  Project,
  ContentWork,
  Experience,
  Education,
  SkillGroup,
} from "./types";
import { AdminDashboard } from "./components/Admin";
import { getDirectImageUrl, getDirectDownloadUrl } from "./utils";
import { handleDatabaseError, OperationType } from "./services/errorHandling";

const getLastYearFromPeriod = (period: string) => {
  const p = period.toLowerCase();
  if (p.includes("en cours") || p.includes("présent")) return 9999;
  const years = period.match(/\d{4}/g);
  return years ? Math.max(...years.map(Number)) : 0;
};

const Login = ({
  onLogin,
}: {
  onLogin: (email: string, pass: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, pass);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold">Admin Access</h1>
          <p className="text-white/40 text-sm">
            Connectez-vous pour gérer vos projets
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <Button type="submit" className="w-full py-4" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [contentWorks, setContentWorks] =
    useState<ContentWork[]>(CONTENT_WORKS);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [education, setEducation] = useState<Education[]>(EDUCATION);
  const [skills, setSkills] = useState<SkillGroup[]>(SKILLS);
  const [settings, setSettings] = useState<any>({
    name: "BT.",
    profileImageUrl: "assets/img/bouba.jpeg",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    imageUrl: string;
    category: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const projectsPath = "projects";
        try {
          const rows = await fetchAllRows<Project>("projects");
          if (rows.length > 0) setProjects(rows);
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, projectsPath);
        }

        const contentPath = "content_works";
        try {
          const rows = await fetchAllRows<ContentWork>("content_works");
          if (rows.length > 0) setContentWorks(rows);
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, contentPath);
        }

        const expPath = "experiences";
        try {
          const data = await fetchAllRows<Experience>("experiences");
          if (data.length > 0) {
            data.sort((a, b) => {
              return getLastYearFromPeriod(b.period) - getLastYearFromPeriod(a.period);
            });
            setExperiences(data);
          }
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, expPath);
        }

        const eduPath = "education";
        try {
          const data = await fetchAllRows<Education>("education");
          if (data.length > 0) {
            data.sort((a, b) => {
              return getLastYearFromPeriod(b.period) - getLastYearFromPeriod(a.period);
            });
            setEducation(data);
          }
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, eduPath);
        }

        const skillsPath = "skills";
        try {
          const rows = await fetchAllRows<SkillGroup & { id: string }>(
            "skills",
          );
          if (rows.length > 0) setSkills(rows);
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, skillsPath);
        }

        const settingsPath = "settings";
        try {
          const row = await fetchLatestSettings();
          if (row) setSettings(row);
        } catch (error) {
          await handleDatabaseError(error, OperationType.GET, settingsPath);
        }
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    if (settings.faviconUrl) {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = getDirectImageUrl(settings.faviconUrl);
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [settings.faviconUrl]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative selection:bg-brand-orange selection:text-white">
      <CustomCursor />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-orange z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar settings={settings} />

      <main className="pb-24 md:pb-0">
        <Hero settings={settings} />

        <Section
          id="projets"
          subtitle="Case Studies"
          title="Projets réalisés"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {projects.map((project, i) => (
              <div
                key={project.id}
                className={i === 0 ? "lg:col-span-2" : undefined}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  layout={i === 0 ? "featured" : "tile"}
                  onClick={() =>
                    setSelectedItem({
                      title: project.title,
                      imageUrl: project.imageUrl,
                      category: project.category,
                      description: project.description,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="créations"
          subtitle="Visual Arts"
          title="Création de Contenus."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentWorks.map((work, i) => (
              <ContentCard
                key={work.id}
                work={work}
                index={i}
                onClick={() =>
                  setSelectedItem({
                    title: work.title,
                    imageUrl: work.imageUrl,
                    category: work.category,
                    description: work.description,
                  })
                }
              />
            ))}
          </div>
        </Section>

        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
          {selectedItem && (
            <div className="flex flex-col lg:flex-row bg-black/40 backdrop-blur-3xl overflow-hidden h-full max-h-[90vh] md:max-h-[85vh]">
              <div className="lg:w-2/3 h-[40vh] md:h-[50vh] lg:h-auto relative overflow-hidden bg-black/20 flex items-center justify-center">
                {(() => {
                  const src = getDirectImageUrl(selectedItem.imageUrl);
                  const isFictif =
                    src.includes("picsum.photos") || src.includes("giphy.com");

                  if (src && !isFictif) {
                    return (
                      <img
                        src={src}
                        alt={selectedItem.title}
                        className="w-full h-full object-contain p-4"
                        referrerPolicy="no-referrer"
                      />
                    );
                  }

                  return (
                    <div className="w-full h-full flex items-center justify-center text-white/40 font-mono text-sm">
                      Image non charger
                    </div>
                  );
                })()}
              </div>
              <div className="lg:w-1/3 p-6 md:p-12 flex flex-col justify-center gap-4 md:gap-6 overflow-y-auto bg-black/60">
                <div>
                  <span className="text-brand-orange font-mono text-[10px] md:text-xs uppercase tracking-widest mb-2 block">
                    {selectedItem.category}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-display font-medium leading-tight mb-3 md:mb-4">
                    {selectedItem.title}
                  </h2>
                  <div className="h-px w-12 bg-brand-orange mb-4 md:mb-6" />
                  <p className="text-white/60 text-sm md:text-lg leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedItem(null)}
                  variant="outline"
                  className="w-full md:w-fit py-3 md:py-4"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <Section
          id="expériences"
          subtitle="Expériences"
          title="Acquis de l'Expérience."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {experiences.map((exp, i) => (
              <ExperienceItem key={exp.id} experience={exp} index={i} />
            ))}
          </div>
        </Section>

        <About settings={settings} />

        <Section
          id="formation"
          subtitle="Parcours"
          title="Acquis de Formation."
        >
          <div className="max-w-4xl">
            {education.map((edu, i) => (
              <TimelineItem key={edu.id} education={edu} index={i} />
            ))}
          </div>
        </Section>

        <SkillsData skillsData={skills} />

        <Contact />
      </main>

      <Footer settings={settings} />
    </div>
  );
};

const Navbar = ({ settings }: { settings: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Accueil", href: "#", icon: Home },
    { label: "Projets", href: "#projets", icon: Briefcase },
    { label: "Créations", href: "#créations", icon: Monitor },
    { label: "À Propos", href: "#à-propos", icon: User },
    { label: "Contact", href: "#contact", icon: MessageSquare },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 hidden md:block ${
          isScrolled
            ? "py-4 glass border-b border-white/10"
            : "py-8 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-display font-bold tracking-tighter cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {settings.name.includes(".") ? (
              <>
                {settings.name.split(".")[0]}
                <span className="text-brand-orange">.</span>
              </>
            ) : (
              settings.name
            )}
          </motion.div>

          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ y: -2 }}
                className="text-xs uppercase font-mono tracking-widest text-white/60 hover:text-white transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          <Button
            variant="outline"
            className="px-6 py-2 text-xs"
            onClick={() => window.open(getDirectDownloadUrl(CV_URL), "_blank")}
          >
            CV
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Top Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 w-full z-50 md:hidden transition-all duration-300 ${
          isScrolled
            ? "glass py-3 border-b border-white/10"
            : "bg-transparent py-4"
        }`}
      >
        <div className="px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-orange/30">
              <img
                src={getDirectImageUrl(
                  settings.profileImageUrl ||
                    "https://picsum.photos/seed/professional-dev/200/200",
                )}
                alt={settings.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(
                    "Mobile profile image load error:",
                    settings.profileImageUrl,
                  );
                  (e.target as HTMLImageElement).src =
                    "https://picsum.photos/seed/profile/200/200";
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-lg font-display font-bold tracking-tighter">
              {settings.name.includes(".") ? (
                <>
                  {settings.name.split(".")[0]}
                  <span className="text-brand-orange">.</span>
                </>
              ) : (
                settings.name
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="px-4 py-1.5 text-[10px] h-auto flex items-center gap-2"
            onClick={() => window.open(getDirectDownloadUrl(CV_URL), "_blank")}
          >
            <Download size={14} />
            <span>CV</span>
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-50 md:hidden pb-safe"
      >
        <div className="mx-4 mb-4 glass border border-white/10 rounded-2xl p-2 flex items-center justify-around shadow-2xl shadow-black">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2 text-white/40 hover:text-brand-orange transition-colors"
            >
              <item.icon size={18} />
              <span className="text-[9px] uppercase font-mono tracking-tighter font-bold">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </motion.nav>
    </>
  );
};

const Hero = ({ settings }: { settings: any }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20">
              Disponible pour de nouveaux défis
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-8"
          >
            Développeur <span className="text-brand-orange">Web / Mobile</span> & UI/UX Designer{" "}
            <br className="hidden sm:block" />
            <span className="italic font-light text-white/80 text-2xl md:text-5xl">
              
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed"
          >
            Je recherche un stage de 3 mois, avec une alternance prévue pour la rentrée prochaine, afin 
            d'appliquer mes compétences techniques au service de projets concrets.
            </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
          >
            <Button
              onClick={() =>
                document
                  .getElementById("projets")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Voir mes projets <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Me contacter
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-shrink-0 hidden md:block"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {/* Decorative Rings */}
            <div className="absolute inset-0 border-2 border-brand-orange/20 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

            {/* Photo Container */}
            <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl shadow-brand-orange/20">
              <img
                src={getDirectImageUrl(
                  settings.profileImageUrl ||
                    "https://picsum.photos/seed/professional-dev/1200/1200",
                )}
                alt={settings.name}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                onError={(e) => {
                  console.error(
                    "Profile image load error:",
                    settings.profileImageUrl,
                  );
                  (e.target as HTMLImageElement).src =
                    "assets/img/boubacar.jpg";
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 glass px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Zap size={16} className="text-brand-orange" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                Full Stack
              </span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Palette size={16} className="text-brand-blue" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                UI/UX
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">
          Scrolllll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-12 bg-gradient-to-b from-brand-orange to-transparent"
        />
      </motion.div>
    </section>
  );
};

const About = ({ settings }: { settings: any }) => {
  return (
    <Section
      id="à-propos"
      subtitle="Storytelling"
      title="Un profil hybride, une vision stratégique."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light">
            Mon parcours est le reflet d'une curiosité insatiable pour le
            numérique. Du{" "}
            <span className="text-white font-medium">
              DUT Informatique de Gestion
            </span>{" "}
            à la
            <span className="text-white font-medium">
              {" "}
              Prépa Master Expert Stratégie Digitale
            </span>
            , j'ai forgé une double compétence rare.
          </p>
          <p className="text-sm md:text-lg text-white/60 leading-relaxed">
            {settings.bio ||
              "Je ne me contente pas de coder des fonctionnalités ; je structure des écosystèmes, j'optimise des parcours utilisateurs et je conçois des interfaces qui racontent une histoire. Ma vision est simple : allier la puissance de IA et du développement à l'élégance du design pour générer un impact réel."}
          </p>

          <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-8">
            <div>
              <h4 className="text-2xl md:text-3xl font-display font-bold text-brand-orange mb-1">
                4+
              </h4>
              <p className="text-[10px] md:text-xs uppercase font-mono tracking-widest text-white/40">
                Années d'études
              </p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-display font-bold text-brand-orange mb-1">
                15+
              </h4>
              <p className="text-[10px] md:text-xs uppercase font-mono tracking-widest text-white/40">
                Projets réalisés
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-2xl overflow-hidden glass p-8 flex flex-col justify-between">
            <div className="space-y-4 md:space-y-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                <Zap size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-medium">
                Ma Valeur Ajoutée
              </h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                Je comble le fossé entre le design et le développement. En
                comprenant les deux mondes, je garantis une fidélité parfaite
                entre le prototype et le produit final, tout en assurant une
                performance technique irréprochable.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Conception centrée utilisateur (UX)",
                "Développement Full Stack robuste",
                "Stratégie digitale orientée résultats",
                "Gestion de projet agile",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-brand-orange" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

const groupCategoryIcon = (i: number) => {
  if (i === 0) return <Code size={22} />;
  if (i === 1) return <Palette size={22} />;
  return <BarChart3 size={22} />;
};

const SkillTile: React.FC<{
  skill: { name: string; icon?: string };
  index: number;
}> = ({ skill, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay: Math.min(index * 0.035, 0.35), duration: 0.4 }}
    whileHover={{ y: -3 }}
    className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-sm shadow-black/20 transition-colors duration-300 hover:border-brand-orange/35 hover:bg-white/[0.07]"
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 p-2 transition-colors duration-300 group-hover:border-brand-orange/30 group-hover:bg-brand-orange/5">
      {skill.icon ? (
        <img
          src={getDirectImageUrl(skill.icon)}
          alt=""
          className="h-full w-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <Zap
          size={20}
          className="text-white/35 transition-colors group-hover:text-brand-orange"
        />
      )}
    </div>
    <span className="min-w-0 truncate text-sm font-medium tracking-tight text-white/90">
      {skill.name}
    </span>
  </motion.div>
);

const SkillsData = ({ skillsData }: { skillsData: SkillGroup[] }) => {
  return (
    <Section
      id="compétences"
      subtitle="Expertise"
      title="Compétences & Technologies"
    >
      <div className="grid gap-8 md:gap-10">
        {skillsData.map((group, i) => (
          <motion.article
            key={group.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent p-6 backdrop-blur-sm md:p-9"
          >
            <header className="mb-6 flex flex-wrap items-center gap-4 md:mb-8 md:gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/25 bg-brand-orange/15 text-brand-orange md:h-14 md:w-14">
                {groupCategoryIcon(i)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl font-medium tracking-tight text-white md:text-3xl">
                  {group.title}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {group.skills.length}{" "}
                  {group.skills.length > 1 ? "éléments" : "élément"}
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.skills.map((skill, idx) => (
                <SkillTile key={skill.name} skill={skill} index={idx} />
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const path = "messages";
    if (!isSupabaseConfigured) {
      setLoading(false);
      alert("Supabase n’est pas configuré : impossible d’envoyer le message.");
      return;
    }
    try {
      await insertRow("messages", {
        ...formData,
        createdAt: new Date().toISOString(),
        read: false,
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      await handleDatabaseError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" subtitle="Contact" title="Travaillons ensemble.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <p className="text-2xl text-white/80 font-light leading-relaxed">
            Vous avez un projet innovant ou une opportunité de collaboration ?
            N'hésitez pas à me contacter pour en discuter.
          </p>

          <div className="space-y-6">
            <a
              href="mailto:boubacartraore8307@gmail.com"
              className="group flex items-center gap-6 p-6 rounded-2xl glass hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-1">
                  Email
                </p>
                <p className="text-lg font-medium">
                  boubacartraore8307@gmail.com
                </p>
              </div>
            </a>

            <div className="flex gap-4">
              {[
                { icon: <Linkedin size={24} />, label: "LinkedIn", href: "#" },
                { icon: <Github size={24} />, label: "GitHub", href: "#" },
                { icon: <Globe size={24} />, label: "Portfolio", href: "#" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(242, 125, 38, 0.2)",
                  }}
                  className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-white/60 hover:text-brand-orange transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-orange transition-colors"
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-orange transition-colors"
                  placeholder="exemple@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">
                Message
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-orange transition-colors resize-none"
                placeholder="Votre message..."
              />
            </div>
            <Button type="submit" className="w-full py-5" disabled={loading}>
              {loading
                ? "Envoi en cours..."
                : success
                  ? "Message envoyé !"
                  : "Envoyer le message"}
            </Button>
            {success && (
              <p className="text-center text-brand-orange text-sm font-medium animate-bounce">
                Merci ! Votre message a été envoyé avec succès.
              </p>
            )}
          </form>
        </div>
      </div>
    </Section>
  );
};

const Footer = ({ settings }: { settings: any }) => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 mb-24 md:mb-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-xl font-display font-bold tracking-tighter">
          {settings.name.includes(".") ? (
            <>
              {settings.name.split(".")[0]}
              <span className="text-brand-orange">.</span>
            </>
          ) : (
            settings.name
          )}
        </div>

        <p className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest text-center">
          © 2026 — Conçu avec passion par {settings.name.replace(".", "")}
        </p>

        <div className="flex items-center gap-6 md:gap-8">
          <a
            href="#"
            className="text-[10px] uppercase font-mono tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Mentions
          </a>
          <a
            href="#"
            className="text-[10px] uppercase font-mono tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Confidentialité
          </a>
        </div>
      </div>
    </footer>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, textarea")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering
          ? "rgba(242, 125, 38, 0.3)"
          : "rgba(255, 255, 255, 0.1)",
      }}
      transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 pointer-events-none z-[9999] hidden lg:block backdrop-blur-[2px]"
    />
  );
};

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) alert("Erreur de connexion : " + error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert("Erreur de déconnexion : " + error.message);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/admin"
          element={
            user ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
