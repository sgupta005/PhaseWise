'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AIGeneratedPhase, PhaseFormData, TaskFormData } from '@/types/project';

interface AIGenerateButtonProps {
  projectTitle: string;
  projectDescription: string;
  techStack: string[];
  onPhasesGenerated: (phases: PhaseFormData[]) => void;
  disabled?: boolean;
}

const LOADING_MESSAGES = [
  '✨ Analyzing your tech stack',
  '📋 Creating phases based on SDLC',
  '✅ Generating tasks for each phase',
  '🔄 Optimizing project timeline',
  '🎯 Assigning task priorities',
];

export function AIGenerateButton({
  projectTitle,
  projectDescription,
  techStack,
  onPhasesGenerated,
  disabled = false,
}: AIGenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    // Validate inputs
    if (!projectTitle.trim()) {
      toast.error('Please enter a project title first');
      return;
    }

    if (techStack.length === 0) {
      toast.error('Please add tech stack before generating phases');
      return;
    }

    setIsGenerating(true);
    setShowDialog(true);
    setCurrentMessageIndex(0); // Reset to first message

    try {
      const response = await fetch('/api/ai/generate-phases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          techStack,
        }),
      });

      const data = await response.json();

      if (data.success && data.phases) {
        // Convert AI-generated phases to PhaseFormData format
        const formattedPhases: PhaseFormData[] = data.phases.map(
          (phase: AIGeneratedPhase, index: number) => ({
            id: `phase-${Date.now()}-${index}`,
            title: phase.title,
            deadline: new Date(phase.deadline).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
            tasks: phase.tasks.map((task, taskIndex) => ({
              id: `task-${Date.now()}-${index}-${taskIndex}`,
              task: task.task,
              assignedTo: [], // User will assign later
              priority: task.priority,
            })) as TaskFormData[],
          })
        );

        onPhasesGenerated(formattedPhases);
        toast.success(
          `Successfully generated ${formattedPhases.length} phases!`
        );
        setShowDialog(false);
      } else {
        toast.error(data.error || 'Failed to generate phases');
      }
    } catch (error) {
      console.error('Error generating phases:', error);
      toast.error('An error occurred while generating phases');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="default"
        onClick={handleGenerate}
        disabled={disabled || isGenerating}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Generate with AI
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generating Project Phases
            </DialogTitle>
            <DialogDescription>
              AI is analyzing your project and creating phases based on SDLC
              methodology...
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Please wait</p>
              <p className="text-xs text-muted-foreground">
                This usually takes 20-30 seconds
              </p>
            </div>
          </div>

          <div className="text-center">
            <p
              key={currentMessageIndex}
              className="text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            >
              {LOADING_MESSAGES[currentMessageIndex]}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
