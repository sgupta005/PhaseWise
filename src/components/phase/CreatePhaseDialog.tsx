'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { TaskFormCard } from './TaskFormCard';

interface CreatePhaseDialogProps {
  projectId: string;
  teamMembers: UserDocument[];
}

export function CreatePhaseDialog({
  projectId,
  teamMembers,
}: CreatePhaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePhaseFormData>({
    resolver: zodResolver(createPhaseFormSchema),
    defaultValues: {
      title: '',
      deadline: '',
      tasks: [
        {
          task: '',
          assignedTo: [],
          priority: 'Medium Priority',
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
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
            <Field>
              <FieldLabel htmlFor="title">
                Phase Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                placeholder="e.g., Planning & Design"
                {...register('title')}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="deadline">
                Deadline <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="deadline" type="date" {...register('deadline')} />
              <FieldError errors={[errors.deadline]} />
            </Field>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FieldLabel>Tasks (optional)</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      task: '',
                      assignedTo: [],
                      priority: 'Medium Priority',
                    })
                  }
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {errors.tasks && <FieldError errors={[errors.tasks]} />}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <TaskFormCard
                    key={field.id}
                    index={index}
                    form={form}
                    teamMembers={teamMembers}
                    onRemove={remove}
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
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
