import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { useEffect, useState } from 'react';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import { Phases } from '@/schemas/project-form.schema';

const LOADING_MESSAGES = [
  '🔍 Analyzing project description',
  '✨ Analyzing your tech stack',
  '📋 Creating phases based on SDLC',
  '🛠️ Optimizing phases for project',
  '⏱️ Assigning deadlines to phases',
  '✅ Generating tasks for each phase',
  '🔄 Optimizing project timeline',
  '🎯 Assigning task priorities',
  '📅 Assigning task due dates',
];

interface AIPhaseGeneratorProps {
  title: string;
  description: string;
  techStack: string;
  onPhasesGenerated: (phases: Phases['phases']) => void;
}

export default function AIPhaseGenerator({
  title,
  description,
  techStack,
  onPhasesGenerated,
}: AIPhaseGeneratorProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isGenerating]);

  async function handleGenerate() {
    setIsGenerating(true);
    setCurrentMessageIndex(0);
    try {
      const response = await fetch('/api/ai/generate-phases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          techStack,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate phases');
      }

      // Pass phases to parent component (already formatted by API)
      onPhasesGenerated(result.phases);
      toast.success('Phases generated successfully!');
    } catch (error) {
      console.error('Error generating phases:', error);
      toast.error('An error occurred while generating phases');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          className="gap-2"
          onClick={handleGenerate}
        >
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
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
          <Spinner className="size-8" />
          <div className="text-center space-y-2">
            <p
              key={currentMessageIndex}
              className="text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            >
              {LOADING_MESSAGES[currentMessageIndex]}
            </p>
            <p className="text-xs text-muted-foreground">
              This usually takes 20-30 seconds
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
