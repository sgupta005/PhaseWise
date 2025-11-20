'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { UserDocument } from '@/models/user.model';
import { PRIORITIES } from '@/constants';
import { CreatePhaseFormData } from '@/schemas/phase-form.schema';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

interface TaskFormCardProps {
  index: number;
  form: UseFormReturn<CreatePhaseFormData>;
  teamMembers: UserDocument[];
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

export function TaskFormCard({
  index,
  form,
  teamMembers,
  onRemove,
  isSubmitting,
}: TaskFormCardProps) {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = form;

  const toggleTaskAssignment = (userId: string) => {
    const currentAssignedTo = watch(`tasks.${index}.assignedTo`) || [];
    const newAssignedTo = currentAssignedTo.includes(userId)
      ? currentAssignedTo.filter((id) => id !== userId)
      : [...currentAssignedTo, userId];
    setValue(`tasks.${index}.assignedTo`, newAssignedTo);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-card">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Task {index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={isSubmitting}
          className="h-6 w-6"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <Field>
        <FieldLabel htmlFor={`tasks.${index}.task`}>
          Description <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id={`tasks.${index}.task`}
          placeholder="Task description"
          {...register(`tasks.${index}.task`)}
        />
        <FieldError errors={[errors.tasks?.[index]?.task]} />
      </Field>

      <Field>
        <FieldLabel htmlFor={`tasks.${index}.priority`}>Priority</FieldLabel>
        <Controller
          name={`tasks.${index}.priority`}
          control={form.control}
          defaultValue="Medium Priority"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={`tasks.${index}.priority`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>Assigned To (optional)</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {teamMembers.map((member) => {
            const assignedTo = watch(`tasks.${index}.assignedTo`) || [];
            const isAssigned = assignedTo.includes(member._id.toString());
            return (
              <Badge
                key={member._id.toString()}
                variant={isAssigned ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleTaskAssignment(member._id.toString())}
              >
                {member.name}
              </Badge>
            );
          })}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor={`tasks.${index}.dueDate`}>
          Due Date (optional)
        </FieldLabel>
        <Input
          id={`tasks.${index}.dueDate`}
          type="date"
          {...register(`tasks.${index}.dueDate`)}
        />
      </Field>
    </div>
  );
}
