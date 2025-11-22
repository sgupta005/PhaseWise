'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Edit, GripVertical } from 'lucide-react';
import { IPhaseWithPopulatedTasks } from '@/types/project.types';
import {
  calculatePhaseProgress,
  getPhaseTaskCounts,
} from '@/lib/phase/progress-calculator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EditPhaseForm } from './EditPhaseForm';
import { DeletePhaseDialog } from './DeletePhaseDialog';
import { TaskDisplayCard } from './TaskDisplayCard';
import { useSortable } from '@dnd-kit/sortable';

interface PhaseDisplayCardProps {
  id: string;
  phase: IPhaseWithPopulatedTasks;
  isChangingPhase: boolean;
  isCurrentPhase: boolean;
  isReorderingPhase: boolean;
  projectId: string;
  onSetCurrent: (phaseOrder: number) => void;
}

export function PhaseDisplayCard({
  id,
  phase,
  isChangingPhase,
  isCurrentPhase,
  isReorderingPhase,
  projectId,
  onSetCurrent,
}: PhaseDisplayCardProps) {
  const progress = calculatePhaseProgress(phase);
  const { completed, total } = getPhaseTaskCounts(phase);
  const isCompleted = phase.completed;
  const isPastDeadline = new Date(phase.deadline) < new Date() && !isCompleted;

  const isLoading = isChangingPhase || isReorderingPhase;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isLoading });

  const style = {
    transform: transform
      ? `translate3d(0, ${transform.y}px, 0)` // Only allow vertical movement
      : undefined,
    transition,
    zIndex: isDragging ? 20 : undefined, // Bring dragged element to front
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border bg-background rounded-lg transition-all  w-full',
        isCurrentPhase && 'border-primary border-2 shadow-md',
        isLoading && 'opacity-80 dark:opacity-70 pointer-events-none'
      )}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={phase._id.toString()} className="border-none">
          <div className="flex items-start gap-4 p-4">
            <div className="flex-shrink-0 pt-1">
              <CircularProgress percentage={progress} size={56} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isCurrentPhase && (
                      <div className="size-3 bg-primary rounded-full" />
                    )}
                    <h3 className="font-semibold text-lg truncate">
                      {`Phase ${phase.order + 1}:`}
                      {phase.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                    <span>
                      Deadline:{' '}
                      <span
                        className={cn(
                          'font-medium',
                          isPastDeadline && 'text-destructive'
                        )}
                      >
                        {format(new Date(phase.deadline), 'MMM dd, yyyy')}
                      </span>
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span>
                      Tasks: {completed}/{total} completed
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <Badge variant="default" className="bg-green-500">
                        ✅ Completed
                      </Badge>
                    ) : isCurrentPhase ? (
                      <Badge variant="default">In Progress</Badge>
                    ) : (
                      <Badge variant="secondary">Not Started</Badge>
                    )}
                    {isPastDeadline && (
                      <Badge variant="destructive">Overdue</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isCurrentPhase && !isCompleted && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSetCurrent(phase.order)}
                      disabled={isChangingPhase}
                    >
                      Set as Current Phase
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing"
                    aria-label="Drag to reorder phase"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </Button>
                  <EditPhaseForm
                    projectId={projectId}
                    phase={phase}
                    trigger={
                      <Button variant="ghost" size="icon" title="Edit phase">
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeletePhaseDialog projectId={projectId} phase={phase} />
                </div>
              </div>

              <div className="mt-4">
                <AccordionTrigger className="hover:no-underline py-2">
                  <span className="text-sm font-medium">
                    {total === 0 ? 'No tasks' : `View All Tasks (${total})`}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {total === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No tasks in this phase
                    </p>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {phase.tasks.map((task) => (
                        <TaskDisplayCard
                          key={task._id.toString()}
                          task={task}
                          projectId={projectId}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
