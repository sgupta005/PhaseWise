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
import { Edit } from 'lucide-react';
import { IPhaseWithPopulatedTasks } from '@/types/project.types';
import {
  calculatePhaseProgress,
  getPhaseTaskCounts,
} from '@/lib/phase/progress-calculator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EditPhaseDialog } from './EditPhaseDialog';
import { DeletePhaseDialog } from './DeletePhaseDialog';
import { TaskDisplayCard } from './TaskDisplayCard';

interface PhaseDisplayCardProps {
  phase: IPhaseWithPopulatedTasks;
  phaseIndex: number;
  isChangingPhase: boolean;
  isCurrentPhase: boolean;
  projectId: string;
  onSetCurrent: (phaseIndex: number) => void;
}

export function PhaseDisplayCard({
  phase,
  phaseIndex,
  isChangingPhase,
  isCurrentPhase,
  projectId,
  onSetCurrent,
}: PhaseDisplayCardProps) {
  const progress = calculatePhaseProgress(phase);
  const { completed, total } = getPhaseTaskCounts(phase);
  const isCompleted = phase.completed;
  const isPastDeadline = new Date(phase.deadline) < new Date() && !isCompleted;

  return (
    <div
      className={cn(
        'border rounded-lg transition-all max-w-7xl w-full',
        isCurrentPhase && 'border-primary border-2 shadow-md'
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
                      onClick={() => onSetCurrent(phaseIndex)}
                      disabled={isChangingPhase}
                    >
                      Set as Current Phase
                    </Button>
                  )}
                  <EditPhaseDialog
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
