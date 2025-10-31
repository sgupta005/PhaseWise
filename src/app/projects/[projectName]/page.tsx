"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

function Page() {
  const [activePhase, setActivePhase] = useState(1);
  const [completedTasks, setCompletedTasks] = useState({});

  const phases = [
    {
      id: 1,
      title: "Phase 1",
      subtitle: "Design and Planning",
      date: "29/10/2025",
      tasks: ["Wireframe creation", "UI Mockups", "Requirement finalization"],
    },
    {
      id: 2,
      title: "Phase 2",
      subtitle: "Development",
      date: "15/11/2025",
      tasks: ["Frontend setup", "Backend integration", "Testing"],
    },
    {
      id: 3,
      title: "Phase 3",
      subtitle: "Deployment and Review",
      date: "01/12/2025",
      tasks: ["Deploy app", "Client feedback", "Final report"],
    },
  ];

  const toggleTask = (phaseId, taskIdx) => {
    const key = `${phaseId}-${taskIdx}`;
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-center p-6">
      {/* Premium Card Container */}
      <div className="w-full max-w-6xl bg-card/50 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-border/50 overflow-hidden">
        <div className="p-16">
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center ring-1 ring-primary/10">
                <span className="text-xl text-primary">✦</span>
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-extralight text-foreground tracking-tight mb-2 leading-tight">
                  Project Timeline
                </h1>
                <p className="text-muted-foreground/70 text-sm font-extralight tracking-wide">
                  Track your project progress through each phase
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 ml-[4.5rem]">
              {["JavaScript", "HTML", "CSS"].map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-[10px] font-light tracking-[0.1em] uppercase rounded-lg bg-secondary/30 text-secondary-foreground/80 border border-border/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex gap-12 mb-20">
            {/* Left Timeline Dots */}
            <div className="relative flex flex-col items-center pt-3">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex flex-col items-center">
                  {/* Dot */}
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-700 ${
                      activePhase === phase.id
                        ? "bg-primary ring-8 ring-primary/10 shadow-lg shadow-primary/30 scale-125"
                        : activePhase > phase.id
                        ? "bg-primary/60"
                        : "bg-border/50"
                    }`}
                  />

                  {/* Line */}
                  {index < phases.length - 1 && (
                    <div
                      className={`w-[1px] h-24 my-4 transition-all duration-700 ${
                        activePhase > phase.id ? "bg-primary/40" : "bg-border/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right Content */}
            <div className="flex-1 space-y-5">
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  className={`border rounded-3xl overflow-hidden transition-all duration-500 ${
                    activePhase === phase.id
                      ? "border-primary/20 shadow-2xl shadow-primary/5 bg-accent/20"
                      : "border-border/40 bg-card/30 hover:border-primary/15 hover:bg-accent/10"
                  }`}
                >
                  {/* Phase Header */}
                  <button
                    className={`w-full flex justify-between items-center px-8 py-6 text-left transition-all duration-500`}
                    onClick={() =>
                      setActivePhase(activePhase === phase.id ? null : phase.id)
                    }
                  >
                    <div>
                      <h3 className="text-xl font-extralight text-card-foreground tracking-wide mb-1">
                        {phase.title}
                      </h3>
                      <p className="text-xs text-muted-foreground/70 font-extralight tracking-wide">
                        {phase.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-[10px] text-muted-foreground/60 font-light tracking-[0.1em] uppercase">
                        {phase.date}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground/50 transition-all duration-500 ${
                          activePhase === phase.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Phase Tasks */}
                  <AnimatePresence>
                    {activePhase === phase.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="border-t border-border/30"
                      >
                        <div className="px-8 py-8 space-y-5">
                          {phase.tasks.map((task, idx) => {
                            const taskKey = `${phase.id}-${idx}`;
                            const isCompleted = completedTasks[taskKey];

                            return (
                              <label
                                key={idx}
                                className="flex items-center gap-5 cursor-pointer group"
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => toggleTask(phase.id, idx)}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-[18px] h-[18px] rounded-lg border flex items-center justify-center transition-all duration-500 ${
                                      isCompleted
                                        ? "bg-primary/90 border-primary/90 shadow-lg shadow-primary/20"
                                        : "border-border/50 group-hover:border-primary/40 group-hover:bg-primary/5"
                                    }`}
                                  >
                                    {isCompleted && (
                                      <Check className="w-3 h-3 text-primary-foreground" />
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`text-sm font-extralight tracking-wide transition-all duration-500 ${
                                    isCompleted
                                      ? "text-muted-foreground/50 line-through"
                                      : "text-foreground/90 group-hover:text-primary group-hover:translate-x-1"
                                  }`}
                                >
                                  {task}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="pt-12 border-t border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              {/* Teammates */}
              <div>
                <h2 className="text-xs font-light text-muted-foreground/60 tracking-[0.15em] uppercase mb-6">
                  Teammates
                </h2>
                <ul className="space-y-4">
                  {["Abc", "mno", "xyz"].map((name, i) => (
                    <li
                      key={i}
                      className="text-base font-extralight text-foreground/80 tracking-wide transition-all duration-300 hover:text-primary hover:translate-x-2"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Faculty */}
              <div>
                <h2 className="text-xs font-light text-muted-foreground/60 tracking-[0.15em] uppercase mb-6">
                  Faculty
                </h2>
                <p className="text-base font-extralight text-foreground/80 tracking-wide">
                  Ravikant
                </p>
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full bg-primary/90 text-primary-foreground py-5 rounded-2xl font-light tracking-[0.1em] text-xs uppercase transition-all duration-500 hover:bg-primary hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;