import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
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
  CheckCircle2
} from 'lucide-react';
import { PROJECTS, EDUCATION, SKILLS, EXPERIENCES, CONTENT_WORKS } from './constants';
import { Section, Button, Badge } from './components/UI';
import { ProjectCard, TimelineItem, ExperienceItem, ContentCard } from './components/Cards';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from './services/firebase';
import { Project, ContentWork, Experience, Education, SkillGroup } from './types';
import { AdminDashboard } from './components/Admin';

const Login = ({ onLogin }: { onLogin: (email: string, pass: string) => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
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
          <p className="text-white/40 text-sm">Connectez-vous pour gérer vos projets</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">Email</label>
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
            <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">Mot de passe</label>
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
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [contentWorks, setContentWorks] = useState<ContentWork[]>(CONTENT_WORKS);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [education, setEducation] = useState<Education[]>(EDUCATION);
  const [skills, setSkills] = useState<SkillGroup[]>(SKILLS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Projects
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        if (!projectsSnapshot.empty) {
          setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
        }

        // Fetch Content Works
        const contentSnapshot = await getDocs(collection(db, 'content_works'));
        if (!contentSnapshot.empty) {
          setContentWorks(contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentWork)));
        }

        // Fetch Experiences
        const expSnapshot = await getDocs(collection(db, 'experiences'));
        if (!expSnapshot.empty) {
          setExperiences(expSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience)));
        }

        // Fetch Education
        const eduSnapshot = await getDocs(collection(db, 'education'));
        if (!eduSnapshot.empty) {
          setEducation(eduSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Education)));
        }

        // Fetch Skills
        const skillsSnapshot = await getDocs(collection(db, 'skills'));
        if (!skillsSnapshot.empty) {
          setSkills(skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
        }
      } catch (error) {
        console.error("Error fetching from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative selection:bg-brand-orange selection:text-white">
      <CustomCursor />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-orange z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        
        <Section id="projets" subtitle="Case Studies" title="Projets Sélectionnés.">
          <div className="space-y-32">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </Section>

        <Section id="créations" subtitle="Visual Arts" title="Création de Contenus.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentWorks.map((work, i) => (
              <ContentCard key={work.id} work={work} index={i} />
            ))}
          </div>
        </Section>

        <Section id="expériences" subtitle="Expériences" title="Acquis de l'Expérience.">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {experiences.map((exp, i) => (
              <ExperienceItem key={exp.id} experience={exp} index={i} />
            ))}
          </div>
        </Section>

        <About />

        <Section id="formation" subtitle="Parcours" title="Acquis de Formation.">
          <div className="max-w-4xl">
            {education.map((edu, i) => (
              <TimelineItem key={edu.id} education={edu} index={i} />
            ))}
          </div>
        </Section>

        <SkillsData skillsData={skills} />

        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

const Navbar = () => {
// ...
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 glass border-b border-white/10' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-display font-bold tracking-tighter cursor-pointer"
        >
          BT<span className="text-brand-orange">.</span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-12">
          {['Projets', 'Créations', 'À Propos', 'Compétences', 'Contact'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              whileHover={{ y: -2 }}
              className="text-xs uppercase font-mono tracking-widest text-white/60 hover:text-white transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <Button variant="outline" className="px-6 py-2 text-xs">
          CV
        </Button>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
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
            Développeur <span className="text-brand-orange">Full Stack</span> <br />
            Web & Mobile <br />
            <span className="italic font-light text-white/80 text-3xl md:text-5xl">& UI/UX Designer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed"
          >
            Je conçois des expériences digitales performantes, esthétiques et centrées utilisateur. 
            Graphiste & Créateur de contenu digital passionné par l'innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
          >
            <Button onClick={() => document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth' })}>
              Voir mes projets <ArrowRight size={18} />
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Me contacter
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-shrink-0"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {/* Decorative Rings */}
            <div className="absolute inset-0 border-2 border-brand-orange/20 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            
            {/* Photo Container */}
            <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl shadow-brand-orange/20">
              <img 
                src="https://picsum.photos/seed/professional-dev/800/800" 
                alt="Boubacar Traoré" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
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
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Full Stack</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Palette size={16} className="text-brand-blue" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">UI/UX</span>
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
        <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-12 bg-gradient-to-b from-brand-orange to-transparent"
        />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <Section id="à-propos" subtitle="Storytelling" title="Un profil hybride, une vision stratégique.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
            Mon parcours est le reflet d'une curiosité insatiable pour le numérique. 
            Du <span className="text-white font-medium">DUT Informatique de Gestion</span> à la 
            <span className="text-white font-medium"> Prépa Master Expert Stratégie Digitale</span>, 
            j'ai forgé une double compétence rare.
          </p>
          <p className="text-lg text-white/60 leading-relaxed">
            Je ne me contente pas de coder des fonctionnalités ; je structure des écosystèmes, 
            j'optimise des parcours utilisateurs et je conçois des interfaces qui racontent une histoire. 
            Ma vision est simple : allier la puissance de IA et du développement à l'élégance du design pour générer un impact réel.
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div>
              <h4 className="text-3xl font-display font-bold text-brand-orange mb-1">4+</h4>
              <p className="text-xs uppercase font-mono tracking-widest text-white/40">Années d'études</p>
            </div>
            <div>
              <h4 className="text-3xl font-display font-bold text-brand-orange mb-1">15+</h4>
              <p className="text-xs uppercase font-mono tracking-widest text-white/40">Projets réalisés</p>
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
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                <Zap size={24} />
              </div>
              <h3 className="text-3xl font-display font-medium">Ma Valeur Ajoutée</h3>
              <p className="text-white/60">
                Je comble le fossé entre le design et le développement. 
                En comprenant les deux mondes, je garantis une fidélité parfaite entre le prototype et le produit final, 
                tout en assurant une performance technique irréprochable.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Conception centrée utilisateur (UX)",
                "Développement Full Stack robuste",
                "Stratégie digitale orientée résultats",
                "Gestion de projet agile"
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

const FloatingSkill = ({ skill, index }: { skill: { name: string; icon?: string }, index: number, key?: string | number }) => {
  // Generate random stable offsets for each skill
  const offsets = useRef({
    x: Math.random() * 60 - 30,
    y: Math.random() * 60 - 30,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 2,
    rotate: Math.random() * 20 - 10
  }).current;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        filter: 'blur(3px)',
        x: offsets.x,
        y: offsets.y,
        rotate: offsets.rotate
      }}
      whileHover={{ 
        scale: 1.25, 
        filter: 'blur(0px)',
        x: 0,
        y: 0,
        rotate: 0,
        zIndex: 50,
        transition: { 
          type: 'spring', 
          stiffness: 400, 
          damping: 25,
          filter: { duration: 0.2 }
        }
      }}
      animate={{
        y: [offsets.y, offsets.y + 15, offsets.y],
        x: [offsets.x, offsets.x + 10, offsets.x],
        rotate: [offsets.rotate, offsets.rotate + 5, offsets.rotate],
      }}
      transition={{
        y: { repeat: Infinity, duration: offsets.duration, ease: "easeInOut" },
        x: { repeat: Infinity, duration: offsets.duration * 1.2, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: offsets.duration * 1.5, ease: "easeInOut" },
      }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full glass flex items-center justify-center p-5 cursor-pointer hover:border-brand-orange/60 transition-all duration-500 shadow-xl shadow-black/40 group-hover:shadow-brand-orange/20 group-hover:bg-white/10">
        {skill.icon ? (
          <img 
            src={skill.icon} 
            alt={skill.name} 
            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(242,125,38,0.5)]" 
            referrerPolicy="no-referrer" 
          />
        ) : (
          <Zap size={28} className="text-white/40 group-hover:text-brand-orange transition-colors" />
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-brand-orange text-white px-3 py-1.5 rounded-full shadow-lg">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
};

const SkillsData = ({ skillsData }: { skillsData: SkillGroup[] }) => {
  return (
    <Section id="compétences" subtitle="Expertise" title="Compétences & Technologies.">
      <div className="space-y-24">
        {skillsData.map((group, i) => (
          <div key={group.title} className="space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                {i === 0 && <Code size={24} />}
                {i === 1 && <Palette size={24} />}
                {i === 2 && <BarChart3 size={24} />}
              </div>
              <h3 className="text-3xl font-display font-medium">{group.title}</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 py-12">
              {group.skills.map((skill, idx) => (
                <FloatingSkill key={skill.name} skill={skill} index={idx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Contact = () => {
  return (
    <Section id="contact" subtitle="Contact" title="Travaillons ensemble.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <p className="text-2xl text-white/80 font-light leading-relaxed">
            Vous avez un projet innovant ou une opportunité de collaboration ? 
            N'hésitez pas à me contacter pour en discuter.
          </p>

          <div className="space-y-6">
            <a href="mailto:contact@example.com" className="group flex items-center gap-6 p-6 rounded-2xl glass hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-1">Email</p>
                <p className="text-lg font-medium">boubacartraore8307@gmail.com</p>
              </div>
            </a>

            <div className="flex gap-4">
              {[
                { icon: <Linkedin size={24} />, label: 'LinkedIn', href: '#' },
                { icon: <Github size={24} />, label: 'GitHub', href: '#' },
                { icon: <Globe size={24} />, label: 'Portfolio', href: '#' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -5, backgroundColor: 'rgba(242, 125, 38, 0.2)' }}
                  className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-white/60 hover:text-brand-orange transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">Nom</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-orange transition-colors" placeholder="exemple" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">Email</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-orange transition-colors" placeholder="exemple@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono tracking-widest text-white/40 ml-1">Message</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-orange transition-colors resize-none" placeholder="Votre message..." />
            </div>
            <Button className="w-full py-5">Envoyer le message</Button>
          </form>
        </div>
      </div>
    </Section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
        <div className="text-xl font-display font-bold tracking-tighter">
          BT<span className="text-brand-orange">.</span>
        </div>
        
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
          © 2026 — Conçu avec  par Boubacar Traoré
        </p>

        <div className="flex items-center gap-8">
          <a href="#" className="text-[10px] uppercase font-mono tracking-widest text-white/40 hover:text-white transition-colors">Mentions Légales</a>
          <a href="#" className="text-[10px] uppercase font-mono tracking-widest text-white/40 hover:text-white transition-colors">Privacy Policy</a>
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
      if (target.closest('button, a, input, textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? 'rgba(242, 125, 38, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 pointer-events-none z-[9999] hidden lg:block backdrop-blur-[2px]"
    />
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      alert('Erreur de connexion : ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert('Erreur de déconnexion : ' + error.message);
    }
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
