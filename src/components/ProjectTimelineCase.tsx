import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, Github, Figma } from "lucide-react";
import type { Project } from "../types";
import { Badge } from "./UI";
import { getDirectImageUrl } from "../utils";

const isFictifImage = (src: string) =>
  src.includes("picsum.photos") || src.includes("giphy.com");

const projectImageSrc = (imageUrl: string) => {
  const raw = getDirectImageUrl(imageUrl);
  if (!raw || isFictifImage(raw)) return "";
  return raw;
};

type TimelineStep = {
  key: string;
  title: string;
  body: string;
};

export function ProjectTimelineCase({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen?: () => void;
}) {
  const caseRef = String(index + 1).padStart(2, "0");
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = useMemo(() => projectImageSrc(project.imageUrl), [project.imageUrl]);

  useEffect(() => setImageFailed(false), [project.imageUrl]);

  const steps = useMemo<TimelineStep[]>(() => {
    const out: TimelineStep[] = [];

    out.push({
      key: "contexte",
      title: "Contexte",
      body: project.description?.trim() || "",
    });

    out.push({
      key: "contrainte",
      title: "Contrainte / enjeu",
      body: project.problem?.trim() || "",
    });

    out.push({
      key: "approche",
      title: "Approche",
      body: project.solution?.trim() || "",
    });

    if (project.results?.trim()) {
      out.push({
        key: "resultat",
        title: "Résultat",
        body: project.results.trim(),
      });
    }

    return out.filter((s) => s.body.length > 0);
  }, [project.description, project.problem, project.solution, project.results]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-6 shadow-2xl shadow-black/25 md:p-8"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Header */}
        <div className="lg:col-span-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand-orange">
                Projet · {caseRef}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                {project.category}
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-4xl">
                {project.title}
              </h3>
              {project.description?.trim() ? (
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                  {project.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
                >
                  Voir le projet <ExternalLink size={16} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
                >
                  Voir le détail <ArrowUpRight size={16} />
                </button>
              )}

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
                >
                  GitHub <Github size={16} />
                </a>
              ) : null}

              {project.figmaUrl ? (
                <a
                  href={project.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
                >
                  Figma <Figma size={16} />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="lg:col-span-5 lg:row-start-2">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-xl shadow-black/40">
            {imageSrc && !imageFailed ? (
              <div className="aspect-[16/10] max-h-[16rem] sm:max-h-[18rem] lg:max-h-[20rem]">
                <img
                  src={imageSrc}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.01]"
                  onError={() => setImageFailed(true)}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="flex min-h-[12rem] items-center justify-center font-mono text-sm text-white/40">
                Image non chargée
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.slice(0, 6).map((t) => (
              <Badge key={t} className="border-white/10 bg-white/[0.05] text-white/80">
                {t}
              </Badge>
            ))}
            {project.stack.length > 6 ? (
              <span className="self-center font-mono text-[10px] text-white/40">
                +{project.stack.length - 6}
              </span>
            ) : null}
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-7 lg:row-start-2">
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />

            <div className="space-y-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.2) }}
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-2 h-[10px] w-[10px] rounded-full border border-white/15 bg-bg-dark shadow-[0_0_0_4px_rgba(242,125,38,0.12)]" />
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-5 transition-colors hover:border-brand-orange/25">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75 md:text-[15px]">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
