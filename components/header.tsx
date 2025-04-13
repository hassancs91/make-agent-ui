'use client';

import { motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-6 px-4 mb-8 animated-bg">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1, 1.05, 1] 
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "loop" 
            }}
            className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">AI Content Manager</h1>
            <p className="text-sm text-muted-foreground">View and manage your AI-generated content</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  );
}
