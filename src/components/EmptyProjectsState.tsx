'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  ArrowRight,
  MoreHorizontal,
  Calendar,
  Users2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { formatPriority, formatStatus } from '@/lib/task/formatters';

const MOCK_CARDS = [
  { id: 1, members: 3 },
  { id: 2, members: 4 },
  { id: 3, members: 2 },
  { id: 4, members: 5 },
];
export default function EmptyProjectsState() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOCK_CARDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [MOCK_CARDS.length]);

  function getCardStyle(index: number) {
    const position =
      (index - activeIndex + MOCK_CARDS.length) % MOCK_CARDS.length;

    // Center card
    if (position === 0) {
      return {
        x: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
        filter: 'blur(0px)',
      };
    }

    // Right card
    if (position === 1) {
      return {
        x: 140,
        scale: 0.85,
        opacity: 1,
        zIndex: 20,
        filter: 'blur(2px)',
      };
    }

    // Last/Left card (appearing from left)
    if (position === MOCK_CARDS.length - 1) {
      return {
        x: -140,
        scale: 0.85,
        opacity: 1,
        zIndex: 20,
        filter: 'blur(2px)',
      };
    }

    // Hidden cards
    return {
      x: 0,
      scale: 0.5,
      opacity: 0,
      zIndex: 10,
      filter: 'blur(4px)',
    };
  }

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center">
        {/* Carousel Section */}
        <div className="relative w-full h-[320px] flex justify-center items-center overflow-hidden">
          {/* Fade overlay on edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-40" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-40" />

          <div className="relative w-[280px] h-[200px] flex items-center justify-center">
            <AnimatePresence initial={false} mode="popLayout">
              {MOCK_CARDS.map((card, index) => {
                const style = getCardStyle(index);
                const isCenter =
                  (index - activeIndex + MOCK_CARDS.length) %
                    MOCK_CARDS.length ===
                  0;

                return (
                  <motion.div
                    key={card.id}
                    initial={false}
                    animate={style}
                    transition={{
                      duration: 1.2,
                      ease: [0.32, 0.72, 0, 1], // Custom bezier for smooth iOS-like movement
                    }}
                    className="absolute top-0 left-0 w-full"
                  >
                    <MockCard data={card} isActive={isCenter} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Section */}
        <div className="text-center max-w-md mx-auto relative z-30">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight mb-3"
          >
            Start building your projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-8 text-base leading-relaxed"
          >
            Create and manage your projects in one place. Track progress,
            collaborate with your team, and hit your deadlines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/create-project">
              <Button
                size="lg"
                className="group h-12 px-8 rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create New Project
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MockCard({
  data,
  isActive,
}: {
  data: (typeof MOCK_CARDS)[0];
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        'w-[280px] shrink-0 rounded-xl border bg-card p-5 shadow-xl transition-all duration-500',
        isActive ? 'border-primary shadow-md' : 'border-border/50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="h-8 w-8 rounded-lg bg-primary/10"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="space-y-1.5">
            <motion.div
              className="h-4 w-24 bg-muted rounded-full"
              animate={{ width: ['60%', '80%', '60%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="h-3 w-16 bg-muted/50 rounded-full" />
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-muted-foreground/40" />
      </div>

      {/* Content */}
      <div className="space-y-3 mb-6 ">
        <motion.div
          className="h-3 w-full bg-muted/40 rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        <motion.div
          className="h-3 w-[85%] bg-muted/40 rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-2">
          {[...Array(data.members)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 + 0.5, type: 'spring' }}
              className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center"
            >
              <Users2 className="w-3 h-3 text-muted-foreground/50" />
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <div className="h-3 w-12 bg-muted/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
