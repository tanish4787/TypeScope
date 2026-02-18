import { Keyboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroHeader() {
  return (
    <motion.header
      className="hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="brand">
        <Keyboard size={22} />
        <h1>TypeScope</h1>
      </div>
      <div className="tag">
        <Sparkles size={16} />
        <span>AI typing intelligence for speed + precision</span>
      </div>
    </motion.header>
  );
}
