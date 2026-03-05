import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export const Section = ({ id, title, subtitle, children, className = '', dark = false }: SectionProps) => {
  return (
    <section id={id} className={`py-24 px-6 md:px-12 lg:px-24 ${dark ? 'bg-black' : 'bg-bg-dark'} ${className}`}>
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
                className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight"
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

export const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false }: { children: ReactNode, onClick?: () => void, className?: string, variant?: 'primary' | 'secondary' | 'outline', type?: 'button' | 'submit' | 'reset', disabled?: boolean }) => {
  const variants = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed',
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

export const Badge = ({ children, className = '' }: { children: ReactNode, className?: string, key?: string | number }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider border border-white/10 bg-white/5 ${className}`}>
    {children}
  </span>
);
