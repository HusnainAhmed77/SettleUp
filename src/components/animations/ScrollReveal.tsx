'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeInUp, fadeIn, fadeInLeft, fadeInRight, scale } from '@/lib/animations';

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

const animationVariants: Record<string, Variants> = {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scale,
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  className,
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  const selectedVariant = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      variants={selectedVariant}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
