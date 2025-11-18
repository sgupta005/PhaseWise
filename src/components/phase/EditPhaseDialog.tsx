'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { IPhaseWithPopulatedTasks } from '@/types/project.types';
import { updatePhaseMetadataAction } from '@/actions/phase.actions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  editPhaseFormSchema,
  type EditPhaseFormData,
} from '@/schemas/phase-form.schema';
import { useRouter } from 'next/navigation';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';

interface EditPhaseDialogProps {
  projectId: string;
  phase: IPhaseWithPopulatedTasks;
  trigger: React.ReactNode;
}

export function EditPhaseDialog({
  projectId,
  phase,
  trigger,
}: EditPhaseDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPhaseFormData>({
    resolver: zodResolver(editPhaseFormSchema),
    defaultValues: {
      title: phase.title,
      deadline: format(new Date(phase.deadline), 'yyyy-MM-dd'),
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        title: phase.title,
        deadline: format(new Date(phase.deadline), 'yyyy-MM-dd'),
      });
    }
  }, [open, phase, reset]);

  async function onSubmit(data: EditPhaseFormData) {
    setIsSubmitting(true);
    try {
      const result = await updatePhaseMetadataAction(
        projectId,
        phase._id.toString(),
        {
          title: data.title,
          deadline: data.deadline,
        }
      );

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating phase:', error);
      toast.error('Failed to update phase');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Phase</DialogTitle>
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

            <Field>
              <FieldDescription>
                ℹ️ To manage tasks within this phase, please use the Tasks page.
                You can only edit the phase title and deadline here.
              </FieldDescription>
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Phase'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
