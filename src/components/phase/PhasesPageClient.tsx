'use client';

import { PhaseDisplayCard } from '@/components/phase/PhaseDisplayCard';
import { CreatePhaseDialog } from '@/components/phase/CreatePhaseDialog';
import {
  IPhaseWithPopulatedTasks,
  IProjectWithTeam,
} from '@/types/project.types';
import { setCurrentPhaseAction } from '@/actions/phase.actions';
import { toast } from 'sonner';
import { useOptimistic, useTransition } from 'react';

interface PhasesPageClientProps {
  projectId: string;
  phases: IPhaseWithPopulatedTasks[];
  project: IProjectWithTeam;
}

export function PhasesPageClient({
  projectId,
  phases,
  project,
}: PhasesPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCurrentPhase, addOptimisticCurrentPhase] = useOptimistic(
    project.currentPhase,
    (currentPhase: number, newPhase: number) => newPhase
  );

  async function handleSetCurrent(phaseIndex: number) {
    try {
      startTransition(async () => {
        addOptimisticCurrentPhase(phaseIndex + 1);
        const result = await setCurrentPhaseAction(projectId, { phaseIndex });
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
    } catch (error) {
      console.error('Error setting current phase:', error);
      toast.error('Failed to set current phase');
    }
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="flex justify-end w-full max-w-7xl">
        <CreatePhaseDialog
          projectId={projectId}
          teamMembers={project.teamMember}
        />
      </div>

      {phases.map((phase, index) => {
        const isCurrentPhase = index + 1 === optimisticCurrentPhase;
        return (
          <PhaseDisplayCard
            isChangingPhase={isPending}
            key={phase._id.toString()}
            phase={phase}
            phaseIndex={index}
            isCurrentPhase={isCurrentPhase}
            projectId={projectId}
            onSetCurrent={handleSetCurrent}
          />
        );
      })}
    </div>
  );
}
