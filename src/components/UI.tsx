import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export const Section = ({
  id,
  title,
  subtitle,
  children,
  className = "",
  dark = false,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 px-6 md:px-12 lg:px-24 ${dark ? "bg-black" : "bg-bg-dark"} ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="mb-16">
            {subtitle && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-brand-orange font-mono text-xs uppercase tracking-widest mb-4 block"
              >
                {subtitle}
              </motion.span>
            )}
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-tight"
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => {
  const variants = {
    primary:
      "bg-brand-orange text-white hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const Badge = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  key?: string | number;
}) => (
  <span
    className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider border border-white/10 bg-white/5 ${className}`}
  >
    {children}
  </span>
);

export const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-end md:items-center justify-center p-0 md:p-12"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-white hover:text-brand-orange hover:bg-white/10 transition-all z-20"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full max-h-[90vh] md:max-h-full overflow-hidden rounded-t-[2rem] md:rounded-3xl shadow-2xl shadow-brand-orange/10 bg-bg-dark md:bg-transparent"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
