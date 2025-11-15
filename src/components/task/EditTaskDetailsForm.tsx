'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ITaskStatus } from '@/types/task.types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editTaskDetailsSchema,
  EditTaskDetailsSchema,
} from '@/schemas/task.schema';
import { toast } from 'sonner';
import { Field, FieldGroup, FieldLabel, FieldError } from '../ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { PRIORITIES } from '@/constants';
import { Spinner } from '@/components/ui/spinner';
import { Edit } from 'lucide-react';
import { editTaskDetailsAction } from '@/actions/task.actions';

interface EditTaskDetailsFormProps {
  taskId: string;
  projectId: string;
  currentPhaseId: string;
  taskData: {
    task: string;
    priority: string;
    status: string;
    assignedTo: string[];
    dueDate?: string | null;
  };
  phases: { _id: string; title: string }[];
  teamMembers: { _id: string; name: string; email: string }[];
  taskStatuses: ITaskStatus[];
}

export default function EditTaskDetailsForm({
  taskId,
  projectId,
  currentPhaseId,
  taskData,
  phases,
  teamMembers,
  taskStatuses,
}: EditTaskDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EditTaskDetailsSchema>({
    resolver: zodResolver(editTaskDetailsSchema),
    defaultValues: {
      taskId,
      projectId,
      task: taskData.task,
      phaseId: currentPhaseId,
      priority: taskData.priority as (typeof PRIORITIES)[number],
      status: taskData.status,
      assignedTo: taskData.assignedTo,
      dueDate: taskData.dueDate || '',
    },
  });

  const { control, handleSubmit, getValues, setValue, reset } = form;

  function toggleAssignment(userId: string) {
    const currentAssignees = getValues('assignedTo') || [];
    const isAssigned = currentAssignees?.includes(userId);
    const newAssignees = isAssigned
      ? currentAssignees.filter((id: string) => id !== userId)
      : [...currentAssignees, userId];
    setValue('assignedTo', newAssignees);
  }

  async function onSubmit(data: EditTaskDetailsSchema) {
    setIsSubmitting(true);

    try {
      const result = await editTaskDetailsAction(data);

      if (result.success) {
        toast.success(result.message || 'Task updated successfully');
        reset(data);
        setIsOpen(false);
      } else {
        toast.error(result.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="size-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>Edit Task Details</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Task Name Input */}
            <Controller
              name="task"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-task-name">
                    Task <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-task-name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="Enter task description"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phase Select */}
            <Controller
              name="phaseId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-task-phase">
                    Phase <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="edit-task-phase" className="w-full">
                      <SelectValue placeholder="Select a phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map((phase) => (
                        <SelectItem key={phase._id} value={phase._id}>
                          {phase.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Priority Select */}
            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-task-priority">
                    Priority <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="edit-task-priority" className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Status Select */}
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-task-status">
                    Status <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="edit-task-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskStatuses.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Assignees */}
            <Controller
              name="assignedTo"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Assignees</FieldLabel>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
                    {teamMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No team members available
                      </p>
                    ) : (
                      teamMembers.map((member) => {
                        const isAssigned = field?.value?.includes(member._id);
                        return (
                          <Badge
                            key={member._id}
                            variant={isAssigned ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() =>
                              !isSubmitting && toggleAssignment(member._id)
                            }
                          >
                            {member.name}
                          </Badge>
                        );
                      })
                    )}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Due Date */}
            <Controller
              name="dueDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-task-dueDate">Due Date</FieldLabel>
                  <Input
                    {...field}
                    id="edit-task-dueDate"
                    type="date"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
