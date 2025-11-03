'use client';

interface StepHeaderProps {
  currentStep: 1 | 2;
}

export function StepHeader({ currentStep }: StepHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
      <p className="text-muted-foreground mt-2">
        Step {currentStep} of 2:{' '}
        {currentStep === 1 ? 'Project Details' : 'Add Phases'}
      </p>
    </div>
  );
}
