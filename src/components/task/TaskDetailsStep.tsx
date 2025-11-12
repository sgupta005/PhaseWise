import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { Field, FieldGroup, FieldLabel, FieldError } from '../ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { TaskFormStepData } from '@/schemas/task-form.schema';
import { ITaskStatus } from '@/types/task.types';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { PRIORITIES } from '@/constants';

export default function TaskDetailsStep({
  getValues,
  setValue,
  control,
  phases,
  teamMembers,
  taskStatuses,
}: {
  getValues: UseFormGetValues<TaskFormStepData>;
  setValue: UseFormSetValue<TaskFormStepData>;
  control: Control<TaskFormStepData>;
  phases: { _id: string; title: string }[];
  teamMembers: { _id: string; name: string; email: string }[];
  taskStatuses: ITaskStatus[];
}) {
  function toggleAssignment(userId: string) {
    const currentAssignees = getValues('assignedTo') || [];
    const isAssigned = currentAssignees?.includes(userId);
    const newAssignees = isAssigned
      ? currentAssignees.filter((id: string) => id !== userId)
      : [...currentAssignees, userId];
    setValue('assignedTo', newAssignees);
  }
  return (
    <form className="space-y-4">
      <FieldGroup>
        {/* Phase Select */}
        <Controller
          name="phaseId"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-form-phase">
                Phase <span className="text-destructive">*</span>
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="task-form-phase" className="w-full">
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Task Input */}
        <Controller
          name="task"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-form-task">
                Task <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="task-form-task"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="Enter task description"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Assigned To */}
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
                        onClick={() => toggleAssignment(member._id)}
                      >
                        {member.name}
                      </Badge>
                    );
                  })
                )}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Status Select */}
        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-form-status">
                Status <span className="text-destructive">*</span>
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="task-form-status" className="w-full">
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Priority Select */}
        <Controller
          name="priority"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-form-priority">Priority</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="task-form-priority" className="w-full">
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Due Date */}
        <Controller
          name="dueDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-form-dueDate">Due Date</FieldLabel>
              <Input
                {...field}
                id="task-form-dueDate"
                type="date"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
