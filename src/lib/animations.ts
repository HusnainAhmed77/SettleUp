import { Variants } from "framer-motion";

// Fade In Animation
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Fade In Up Animation
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Fade In Down Animation
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Fade In Left Animation
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// Fade In Right Animation
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Scale Animation
export const scale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// Stagger Container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Stagger Item
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Slide In Left
export const slideInLeft: Variants = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
};

// Slide In Right
export const slideInRight: Variants = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
};

// Slide In Up
export const slideInUp: Variants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
};

// Slide In Down
export const slideInDown: Variants = {
  initial: { y: "-100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

// Rotate Animation
export const rotate: Variants = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
};

// Pulse Animation
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Bounce Animation
export const bounce: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Default Transition
export const defaultTransition = {
  duration: 0.5,
  ease: "easeOut",
};

// Spring Transition
export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// Smooth Transition
export const smoothTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};
