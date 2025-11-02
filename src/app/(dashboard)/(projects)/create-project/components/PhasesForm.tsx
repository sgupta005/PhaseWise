'use client';

import { Plus, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PhaseCard } from './PhaseCard';
import { AIGenerateButton } from './AIGenerateButton';
import { PhaseFormData, IUser } from '@/types/project';

interface PhasesFormProps {
  phases: PhaseFormData[];
  teamMembers: IUser[];
  projectTitle: string;
  projectDescription: string;
  techStack: string[];
  onAddPhase: () => void;
  onUpdatePhase: (index: number, phase: PhaseFormData) => void;
  onRemovePhase: (index: number) => void;
  onPhasesGenerated: (phases: PhaseFormData[]) => void;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  errors: { [key: string]: string };
}

export function PhasesForm({
  phases,
  teamMembers,
  projectTitle,
  projectDescription,
  techStack,
  onAddPhase,
  onUpdatePhase,
  onRemovePhase,
  onPhasesGenerated,
  onBack,
  onSave,
  isSaving,
  errors,
}: PhasesFormProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Project Phases</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Break down your project into phases with tasks
            </p>
          </div>
          <div className="flex gap-2">
            <AIGenerateButton
              projectTitle={projectTitle}
              projectDescription={projectDescription}
              techStack={techStack}
              onPhasesGenerated={onPhasesGenerated}
              disabled={isSaving}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddPhase}
              disabled={isSaving}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Phase
            </Button>
          </div>
        </div>

        {/* General Errors */}
        {errors.general && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {errors.general}
          </div>
        )}

        {/* Phases List */}
        {phases.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              No phases yet. Add your first phase to get started.
            </p>
            <Button type="button" onClick={onAddPhase}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Phase
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                phaseIndex={index}
                teamMembers={teamMembers}
                onChange={(updatedPhase) => onUpdatePhase(index, updatedPhase)}
                onRemove={() => onRemovePhase(index)}
                canRemove={phases.length > 1}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving || phases.length === 0}
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Project...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
