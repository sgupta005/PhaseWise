'use client';

interface ProgressIndicatorProps {
  step1Progress: number;
  step2Progress: number;
}

export function ProgressIndicator({
  step1Progress,
  step2Progress,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-2">
      {/* Step 1 Progress */}
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${step1Progress}%` }}
        />
      </div>
      {/* Step 2 Progress */}
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${step2Progress}%` }}
        />
      </div>
    </div>
  );
}
