import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, ArrowRight, Github, Figma } from "lucide-react";
import { Project, Education, Experience, ContentWork } from "../types";
import { Badge } from "./UI";
import { getDirectImageUrl } from "../utils";

export const ContentCard: React.FC<{
  work: ContentWork;
  index: number;
  onClick?: () => void;
}> = ({ work, index, onClick }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrcRaw = getDirectImageUrl(work.imageUrl);
  const imageSrc =
    imageSrcRaw &&
    !(
      imageSrcRaw.includes("picsum.photos") ||
      imageSrcRaw.includes("giphy.com")
    )
      ? imageSrcRaw
      : "";

  useEffect(() => {
    setImageFailed(false);
  }, [work.imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative glass rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
    >
      {imageSrc && !imageFailed ? (
        <img
          src={imageSrc}
          alt={work.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          onError={() => setImageFailed(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black/20 text-white/40 font-mono text-sm">
          Image non charger
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <span className="text-brand-orange font-mono text-[10px] uppercase tracking-widest mb-2">
          {work.category}
        </span>
        <h3 className="text-xl font-display font-medium text-white mb-2">
          {work.title}
        </h3>
        {work.description && (
          <p className="text-white/60 text-xs line-clamp-2">
            {work.description}
          </p>
        )}
      </div>

      {/* Category Badge (Visible by default) */}
      <div className="absolute top-4 right-4 group-hover:opacity-0 transition-opacity duration-300">
        <Badge className="bg-black/60 backdrop-blur-md border-white/10">
          {work.category}
        </Badge>
      </div>
    </motion.div>
  );
};

const projectImageSrc = (imageUrl: string) => {
  const raw = getDirectImageUrl(imageUrl);
  if (
    !raw ||
    raw.includes("picsum.photos") ||
    raw.includes("giphy.com")
  ) {
    return "";
  }
  return raw;
};

const ProjectMedia: React.FC<{
  imageSrc: string;
  imageFailed: boolean;
  onImageError: () => void;
  className?: string;
  imgClassName?: string;
}> = ({ imageSrc, imageFailed, onImageError, className = "", imgClassName = "" }) => (
  <div className={`relative overflow-hidden bg-black/30 ${className}`}>
    {imageSrc && !imageFailed ? (
      <img
        src={imageSrc}
        alt=""
        className={`h-full w-full object-cover ${imgClassName}`}
        onError={onImageError}
        referrerPolicy="no-referrer"
      />
    ) : (
      <div className="flex h-full min-h-[12rem] w-full items-center justify-center font-mono text-sm text-white/40">
        Image non charger
      </div>
    )}
  </div>
);

const ProjectActions: React.FC<{
  project: Project;
  onClick?: () => void;
  compact?: boolean;
}> = ({ project, onClick, compact }) => (
  <div
    className={`flex flex-wrap items-center gap-3 ${compact ? "mt-5" : "mt-8 gap-4 md:gap-6"}`}
  >
    {project.link ? (
      <motion.a
        whileHover={{ x: 4 }}
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group/btn inline-flex items-center gap-2 font-medium text-white md:gap-3"
      >
        <span className={compact ? "text-sm" : ""}>Voir le projet</span>
        <div
          className={`flex items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover/btn:border-brand-orange group-hover/btn:bg-brand-orange ${compact ? "h-9 w-9" : "h-10 w-10"}`}
        >
          <ExternalLink size={compact ? 15 : 17} />
        </div>
      </motion.a>
    ) : (
      <motion.button
        type="button"
        whileHover={{ x: 4 }}
        onClick={onClick}
        className="group/btn inline-flex items-center gap-2 font-medium text-white md:gap-3"
      >
        <span className={compact ? "text-sm" : ""}>Détails</span>
        <div
          className={`flex items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover/btn:border-brand-orange group-hover/btn:bg-brand-orange ${compact ? "h-9 w-9" : "h-10 w-10"}`}
        >
          <ArrowRight size={compact ? 16 : 18} />
        </div>
      </motion.button>
    )}
    <div className="flex items-center gap-2">
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-white/30 hover:text-white ${compact ? "h-9 w-9" : "h-10 w-10"}`}
          title="GitHub"
        >
          <Github size={compact ? 16 : 18} />
        </a>
      )}
      {project.figmaUrl && (
        <a
          href={project.figmaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-white/30 hover:text-white ${compact ? "h-9 w-9" : "h-10 w-10"}`}
          title="Figma"
        >
          <Figma size={compact ? 16 : 18} />
        </a>
      )}
    </div>
  </div>
);

export const ProjectCard: React.FC<{
  project: Project;
  index: number;
  onClick?: () => void;
  /** "featured" = pleine largeur split image | contenu ; "tile" = carte compacte grille */
  layout?: "featured" | "tile";
}> = ({ project, index, onClick, layout = "featured" }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = projectImageSrc(project.imageUrl);

  useEffect(() => {
    setImageFailed(false);
  }, [project.imageUrl]);

  const caseRef = String(index + 1).padStart(2, "0");
  const mediaHandlers = {
    onImageError: () => setImageFailed(true),
    imageSrc,
    imageFailed,
  };

  if (layout === "tile") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/20 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-brand-orange/5"
      >
        <div
          onClick={onClick}
          onKeyDown={(e) => {
            if (!onClick) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick();
            }
          }}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          className="relative h-52 w-full shrink-0 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange"
        >
          <ProjectMedia
            {...mediaHandlers}
            className="absolute inset-0 h-full"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-brand-orange">
              {caseRef}
            </span>
            <Badge className="border-white/20 bg-black/50 text-[9px] backdrop-blur-sm">
              {project.category}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-medium leading-snug text-white transition-colors group-hover:text-brand-orange md:text-xl">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">
            {project.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-brand-orange/90">
                Problème
              </p>
              <p className="line-clamp-3 text-xs leading-relaxed text-white/70">
                {project.problem}
              </p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-brand-blue">
                Solution
              </p>
              <p className="line-clamp-3 text-xs leading-relaxed text-white/70">
                {project.solution}
              </p>
            </div>
          </div>

          {project.results?.trim() ? (
            <p className="mt-3 line-clamp-2 rounded-lg border border-brand-orange/20 bg-brand-orange/[0.07] px-3 py-2 text-xs text-white/75">
              {project.results}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((tech) => (
              <Badge
                key={tech}
                className="border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px]"
              >
                {tech}
              </Badge>
            ))}
            {project.stack.length > 5 ? (
              <span className="self-center font-mono text-[9px] text-white/35">
                +{project.stack.length - 5}
              </span>
            ) : null}
          </div>

          <div className="mt-auto pt-2">
            <ProjectActions project={project} onClick={onClick} compact />
          </div>
        </div>
      </motion.article>
    );
  }

  /* --- layout featured : split desktop --- */
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-2xl shadow-black/30 transition-colors duration-500 hover:border-brand-orange/25 lg:grid lg:min-h-[22rem] lg:grid-cols-[1fr_minmax(0,1.15fr)]"
    >
      <div
        onClick={onClick}
        onKeyDown={(e) => {
          if (!onClick) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden lg:aspect-auto lg:min-h-[22rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
      >
        <ProjectMedia
          {...mediaHandlers}
          className="absolute inset-0 h-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/75" />
        <div className="absolute inset-x-0 bottom-0 p-6 lg:inset-y-0 lg:left-0 lg:flex lg:w-full lg:flex-col lg:justify-end lg:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-orange">
            À la une · {caseRef}
          </p>
          <h3 className="mt-2 max-w-md font-display text-2xl font-medium leading-tight text-white lg:text-3xl xl:text-4xl">
            {project.title}
          </h3>
        </div>
        {onClick && (
          <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest text-white/70 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
            Aperçu
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center border-t border-white/10 p-6 md:p-8 lg:border-l lg:border-t-0 lg:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 lg:hidden">
          <Badge className="border-white/15 bg-white/[0.06]">
            {project.category}
          </Badge>
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-widest text-white/40 lg:mb-2 lg:block">
          {project.category}
        </p>
        <p className="text-base leading-relaxed text-white/65 md:text-lg">
          {project.description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h4 className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-brand-orange/90">
              Problématique
            </h4>
            <p className="text-sm leading-relaxed text-white/80">
              {project.problem}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h4 className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-brand-blue">
              Solution
            </h4>
            <p className="text-sm leading-relaxed text-white/80">
              {project.solution}
            </p>
          </div>
        </div>

        {project.results?.trim() ? (
          <div className="mt-4 rounded-xl border border-brand-orange/25 bg-brand-orange/[0.06] p-4">
            <h4 className="mb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">
              Résultats
            </h4>
            <p className="text-sm leading-relaxed text-white/85">
              {project.results}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech} className="border-white/15 bg-white/[0.06]">
              {tech}
            </Badge>
          ))}
        </div>

        <ProjectActions project={project} onClick={onClick} />
      </div>
    </motion.article>
  );
};

export const TimelineItem: React.FC<{
  education: Education;
  index: number;
}> = ({ education, index }) => {
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
            <span className="text-brand-orange font-mono text-[10px] md:text-xs uppercase tracking-widest mb-1 block">
              {education.period}
            </span>
            <h3 className="text-xl md:text-2xl font-display font-medium">
              {education.title}
            </h3>
            <p className="text-white/60 text-sm md:text-base">
              {education.institution}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-2 md:mt-4">
          <div>
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-3">
              Compétences
            </h4>
            <ul className="flex flex-wrap gap-2">
              {education.skills.map((s) => (
                <Badge key={s} className="bg-white/5">
                  {s}
                </Badge>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-3">
              Technologies
            </h4>
            <ul className="flex flex-wrap gap-2">
              {education.technologies.map((t) => (
                <Badge
                  key={t}
                  className="bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                >
                  {t}
                </Badge>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-3">
              Méthodologies
            </h4>
            <ul className="flex flex-wrap gap-2">
              {education.methodologies.map((m) => (
                <Badge key={m} className="bg-white/5">
                  {m}
                </Badge>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ExperienceItem: React.FC<{
  experience: Experience;
  index: number;
}> = ({ experience, index }) => {
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
          <h3 className="text-lg md:text-xl font-display font-medium text-white">
            {experience.title}
          </h3>
          <p className="text-brand-orange font-mono text-[10px] md:text-xs uppercase tracking-widest">
            {experience.company}
          </p>
        </div>
        <Badge className="bg-white/5 text-[10px]">{experience.period}</Badge>
      </div>
      <p className="text-white/60 text-xs md:text-sm leading-relaxed">
        {experience.description}
      </p>
    </motion.div>
  );
};
