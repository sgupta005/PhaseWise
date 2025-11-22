'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { UserDocument } from '@/models/user.model';
import { createPhaseAction } from '@/actions/phase.actions';
import { toast } from 'sonner';
import {
  createPhaseFormSchema,
  type CreatePhaseFormData,
} from '@/schemas/phase-form.schema';
import PhaseTaskForm from './PhaseTaskForm';

interface CreatePhaseDialogProps {
  projectId: string;
  teamMembers: UserDocument[];
}

export function CreatePhaseForm({
  projectId,
  teamMembers,
}: CreatePhaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePhaseFormData>({
    resolver: zodResolver(createPhaseFormSchema),
    defaultValues: {
      title: '',
      deadline: '',
      tasks: [],
    },
  });

  async function onSubmit(data: CreatePhaseFormData) {
    setIsSubmitting(true);
    try {
      const result = await createPhaseAction(projectId, data);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error creating phase:', error);
      toast.error('Failed to create phase');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New Phase
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Phase</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 py-4">
            {/* Phase Title */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Phase Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g., Planning & Design"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Provide a concise title for your phase.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Phase Deadline */}
            <Controller
              name="deadline"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Deadline <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="date"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Set a deadline for your phase.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="space-y-4">
              <PhaseTaskForm
                control={control}
                setValue={setValue}
                teamMembers={teamMembers}
                tasksFieldPath="tasks"
              />

              {errors.tasks && <FieldError errors={[errors.tasks]} />}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Phase'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
