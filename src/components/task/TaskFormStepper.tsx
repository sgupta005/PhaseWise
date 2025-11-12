'use client';

import { cn } from '@/lib/utils';

interface TaskFormStepperProps {
  currentStep: number;
}

export function TaskFormStepper({ currentStep }: TaskFormStepperProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex items-center px-24 w-full">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
            currentStep === 0
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/30 bg-muted text-muted-foreground'
          }`}
        >
          1
        </div>
        <div className="h-0.5 flex-1  bg-border" />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
            currentStep === 1
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/30 bg-muted text-muted-foreground'
          }`}
        >
          2
        </div>
      </div>
      <div className="flex items-center px-20 w-full justify-between">
        <p
          className={`text-sm font-medium ${
            currentStep === 0 ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          Task Details
        </p>
        <p
          className={`text-sm font-medium ${
            currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          Subtasks
        </p>
      </div>
    </div>
  );
}
