import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Project, Education, Experience, ContentWork } from '../types';
import { Badge } from './UI';
import { getDirectImageUrl } from '../utils';

export const ContentCard: React.FC<{ work: ContentWork, index: number }> = ({ work, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group relative glass rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
    >
      <img
        src={getDirectImageUrl(work.imageUrl) || 'https://picsum.photos/seed/placeholder/1200/1600'}
        alt={work.title}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/1200/1600';
        }}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <span className="text-brand-orange font-mono text-[10px] uppercase tracking-widest mb-2">{work.category}</span>
        <h3 className="text-xl font-display font-medium text-white mb-2">{work.title}</h3>
        {work.description && <p className="text-white/60 text-xs line-clamp-2">{work.description}</p>}
      </div>
      
      {/* Category Badge (Visible by default) */}
      <div className="absolute top-4 right-4 group-hover:opacity-0 transition-opacity duration-300">
        <Badge className="bg-black/60 backdrop-blur-md border-white/10">{work.category}</Badge>
      </div>
    </motion.div>
  );
};

export const ProjectCard: React.FC<{ project: Project, index: number }> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32 last:mb-0"
    >
      <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-brand-orange font-mono text-xs uppercase tracking-widest">{project.category}</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <h3 className="text-3xl md:text-5xl font-display font-medium leading-tight group-hover:text-brand-orange transition-colors duration-500">
            {project.title}
          </h3>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl">
            {project.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-white/10">
            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-2">Problématique</h4>
              <p className="text-sm text-white/80">{project.problem}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-2">Solution</h4>
              <p className="text-sm text-white/80">{project.solution}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>

          <motion.button
            whileHover={{ x: 10 }}
            className="flex items-center gap-3 text-white font-medium group/btn mt-4"
          >
            <span>Voir le projet</span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-orange group-hover/btn:border-brand-orange transition-all duration-300">
              <ArrowRight size={18} />
            </div>
          </motion.button>
        </div>
      </div>

      <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} relative overflow-hidden rounded-2xl aspect-[4/3] lg:aspect-square`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          <img
            src={getDirectImageUrl(project.imageUrl) || 'https://picsum.photos/seed/placeholder/1600/1200'}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/1600/1200';
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-700" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const TimelineItem: React.FC<{ education: Education, index: number }> = ({ education, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-12 pb-16 last:pb-0 border-l border-white/10 group"
    >
      <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-white/20 group-hover:bg-brand-orange transition-colors duration-300" />
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-brand-orange font-mono text-xs uppercase tracking-widest mb-1 block">{education.period}</span>
            <h3 className="text-2xl font-display font-medium">{education.title}</h3>
            <p className="text-white/60">{education.institution}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-3">Compétences</h4>
            <ul className="flex flex-wrap gap-2">
              {education.skills.map(s => <Badge key={s} className="bg-white/5">{s}</Badge>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-3">Technologies</h4>
            <ul className="flex flex-wrap gap-2">
              {education.technologies.map(t => <Badge key={t} className="bg-brand-blue/10 text-brand-blue border-brand-blue/20">{t}</Badge>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-3">Méthodologies</h4>
            <ul className="flex flex-wrap gap-2">
              {education.methodologies.map(m => <Badge key={m} className="bg-white/5">{m}</Badge>)}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ExperienceItem: React.FC<{ experience: Experience, index: number }> = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass p-8 rounded-2xl border border-white/5 hover:border-brand-orange/20 transition-all duration-500"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-display font-medium text-white">{experience.title}</h3>
          <p className="text-brand-orange font-mono text-xs uppercase tracking-widest">{experience.company}</p>
        </div>
        <Badge className="bg-white/5">{experience.period}</Badge>
      </div>
      <p className="text-white/60 text-sm leading-relaxed">
        {experience.description}
      </p>
    </motion.div>
  );
};
