'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';
import { createSubtaskAction } from '@/actions/subtask.actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { subtaskSchema, SubtaskFormData } from '@/schemas/subtask.schema';

interface CreateSubtaskDialogProps {
  taskId: string;
  projectId: string;
  teamMembers: { _id: string; name: string; email: string }[];
  children: React.ReactNode;
  onOptimisticAdd: (data: { title: string }) => void;
}

export default function CreateSubtaskDialog({
  taskId,
  projectId,
  teamMembers,
  children,
  onOptimisticAdd,
}: CreateSubtaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskSchema),
    defaultValues: {
      title: '',
    },
  });

  function onSubmit(data: SubtaskFormData) {
    setOpen(false);
    reset();

    startTransition(async () => {
      onOptimisticAdd({ title: data.title });
      const result = await createSubtaskAction(taskId, projectId, data);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Subtask</DialogTitle>
          <DialogDescription>
            Break down this task into a smaller, manageable step.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <Field>
            <FieldLabel htmlFor="title">
              Title <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="title"
              placeholder="Enter subtask title..."
              {...register('title')}
              disabled={isPending}
            />
            <FieldDescription>
              Provide a clear and concise title for this subtask.
            </FieldDescription>
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Subtask
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
