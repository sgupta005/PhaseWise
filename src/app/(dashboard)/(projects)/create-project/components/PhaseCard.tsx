'use client';

import { X, Plus, Trash2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PhaseFormData, TaskFormData, IUser } from '@/types/project.types';

interface PhaseCardProps {
  phase: PhaseFormData;
  phaseIndex: number;
  teamMembers: IUser[];
  onChange: (updatedPhase: PhaseFormData) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function PhaseCard({
  phase,
  phaseIndex,
  teamMembers,
  onChange,
  onRemove,
  canRemove,
}: PhaseCardProps) {
  const updatePhase = (field: keyof PhaseFormData, value: any) => {
    onChange({ ...phase, [field]: value });
  };

  const addTask = () => {
    const newTask: TaskFormData = {
      id: `task-${Date.now()}`,
      task: '',
      assignedTo: [],
      priority: 'Medium Priority',
    };
    updatePhase('tasks', [...phase.tasks, newTask]);
  };

  const updateTask = (
    taskIndex: number,
    field: keyof TaskFormData,
    value: any
  ) => {
    const updatedTasks = [...phase.tasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], [field]: value };
    updatePhase('tasks', updatedTasks);
  };

  const removeTask = (taskIndex: number) => {
    const updatedTasks = phase.tasks.filter((_, idx) => idx !== taskIndex);
    updatePhase('tasks', updatedTasks);
  };

  const toggleTaskAssignment = (taskIndex: number, userId: string) => {
    const task = phase.tasks[taskIndex];
    const isAssigned = task.assignedTo.includes(userId);
    const newAssignedTo = isAssigned
      ? task.assignedTo.filter((id) => id !== userId)
      : [...task.assignedTo, userId];
    updateTask(taskIndex, 'assignedTo', newAssignedTo);
  };

  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg">
      <AccordionItem value={phase.id} className="border-none">
        <div className="flex items-center gap-2 px-4">
          <AccordionTrigger className="flex-1 hover:no-underline py-4">
            <span className="font-semibold">
              Phase {phaseIndex + 1}
              {phase.title && `: ${phase.title}`}
            </span>
          </AccordionTrigger>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <AccordionContent className="px-4 pb-4 space-y-4">
          {/* Phase Title and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`phase-title-${phase.id}`}>
                Phase Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`phase-title-${phase.id}`}
                placeholder="e.g., Planning and Design"
                value={phase.title}
                onChange={(e) => updatePhase('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phase-deadline-${phase.id}`}>
                Deadline <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`phase-deadline-${phase.id}`}
                type="date"
                value={phase.deadline}
                onChange={(e) => updatePhase('deadline', e.target.value)}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTask}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>

            {phase.tasks.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                No tasks yet. Click &quot;Add Task&quot; to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {phase.tasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    className="p-4 border rounded-lg space-y-3 bg-muted/30"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-3">
                        {/* Task Description */}
                        <div className="space-y-2">
                          <Label htmlFor={`task-desc-${task.id}`}>
                            Task Description{' '}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`task-desc-${task.id}`}
                            placeholder="Describe the task..."
                            value={task.task}
                            onChange={(e) =>
                              updateTask(taskIndex, 'task', e.target.value)
                            }
                          />
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select
                            value={task.priority}
                            onValueChange={(value) =>
                              updateTask(taskIndex, 'priority', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low Priority">
                                Low Priority
                              </SelectItem>
                              <SelectItem value="Medium Priority">
                                Medium Priority
                              </SelectItem>
                              <SelectItem value="High Priority">
                                High Priority
                              </SelectItem>
                              <SelectItem value="Urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Assigned To */}
                        <div className="space-y-2">
                          <Label>Assigned To</Label>
                          <div className="flex flex-wrap gap-2">
                            {teamMembers.length === 0 ? (
                              <p className="text-sm text-muted-foreground italic">
                                No team members selected yet
                              </p>
                            ) : (
                              teamMembers.map((member) => {
                                const isAssigned = task.assignedTo.includes(
                                  member._id
                                );
                                return (
                                  <Badge
                                    key={member._id}
                                    variant={isAssigned ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() =>
                                      toggleTaskAssignment(
                                        taskIndex,
                                        member._id
                                      )
                                    }
                                  >
                                    {member.name}
                                  </Badge>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(taskIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
