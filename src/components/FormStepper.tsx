'use client';

import { Fragment } from 'react';

interface FormStepperProps {
  currentStep: number;
  steps: string[];
}

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex items-center px-24 w-full">
        {steps.map((step, index) => {
          return (
            <Fragment key={index}>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                  currentStep === index
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30 bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              {index !== steps.length - 1 && (
                <div className="h-0.5 flex-1  bg-border" />
              )}
            </Fragment>
          );
        })}
      </div>
      <div className="flex items-center px-20 w-full justify-between">
        {steps.map((step, index) => {
          return (
            <p
              key={index}
              className={`text-sm font-medium ${
                currentStep === index
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {step}
            </p>
          );
        })}
      </div>
    </div>
  );
}
