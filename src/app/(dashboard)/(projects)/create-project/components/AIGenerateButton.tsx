'use client';

import { useState } from 'react';
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

export function AIGenerateButton({
  projectTitle,
  projectDescription,
  techStack,
  onPhasesGenerated,
  disabled = false,
}: AIGenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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
                This usually takes 10-15 seconds
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <p>✨ Analyzing your tech stack</p>
            <p>📋 Creating phases based on SDLC</p>
            <p>✅ Generating tasks for each phase</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
