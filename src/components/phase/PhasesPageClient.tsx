'use client';

import { PhaseDisplayCard } from '@/components/phase/PhaseDisplayCard';
import { CreatePhaseDialog } from '@/components/phase/CreatePhaseDialog';
import {
  IPhaseWithPopulatedTasks,
  IProjectWithTeam,
} from '@/types/project.types';
import {
  setCurrentPhaseAction,
  reorderPhasesAction,
} from '@/actions/phase.actions';
import { toast } from 'sonner';
import { useOptimistic, useTransition } from 'react';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

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
  const [isUpdatingCurrentPhase, startUpdateCurrentPhaseTransition] =
    useTransition();
  const [isReorderingPhases, startReorderingPhasesTransition] = useTransition();

  const [optimisticCurrentPhase, addOptimisticCurrentPhase] = useOptimistic(
    project.currentPhase,
    (currentPhase: number, newPhase: number) => newPhase
  );

  const [optimisticPhases, reorderOptimisticPhases] = useOptimistic(
    phases,
    (
      oldPhases: IPhaseWithPopulatedTasks[],
      newPhases: IPhaseWithPopulatedTasks[]
    ) => {
      // Update the order property of each phase to match the new array position
      return newPhases.map((phase, idx) => ({
        ...phase,
        order: idx,
      }));
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleSetCurrent(phaseOrder: number) {
    try {
      startUpdateCurrentPhaseTransition(async () => {
        addOptimisticCurrentPhase(phaseOrder);
        const result = await setCurrentPhaseAction(projectId, { phaseOrder });
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = optimisticPhases.findIndex(
        (p) => p._id.toString() === active.id
      );
      const newIndex = optimisticPhases.findIndex(
        (p) => p._id.toString() === over.id
      );

      const reorderedPhases = arrayMove(optimisticPhases, oldIndex, newIndex);

      startReorderingPhasesTransition(async () => {
        // Optimistic update with the reordered phases
        reorderOptimisticPhases(reorderedPhases);

        const phaseIds = reorderedPhases.map((p) => p._id.toString());
        const result = await reorderPhasesAction(projectId, phaseIds);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={phases.map((phase) => phase._id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {optimisticPhases.map((phase, index) => {
            const isCurrentPhase = index === optimisticCurrentPhase;
            return (
              <PhaseDisplayCard
                isChangingPhase={isUpdatingCurrentPhase}
                isReorderingPhase={isReorderingPhases}
                key={phase._id.toString()}
                id={phase._id.toString()}
                phase={phase}
                isCurrentPhase={isCurrentPhase}
                projectId={projectId}
                onSetCurrent={handleSetCurrent}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
