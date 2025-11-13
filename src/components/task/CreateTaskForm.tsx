'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { ITaskStatus } from '@/types/task.types';
import { useTaskForm } from '@/hooks/task/useTaskForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TaskFormStepData,
  TaskFormAllFields,
} from '@/schemas/task-form.schema';
import { toast } from 'sonner';
import { TaskFormStepper } from './TaskFormStepper';
import TaskDetailsStep from './TaskDetailsStep';
import SubtaskStep from './SubtaskStep';
import { Spinner } from '@/components/ui/spinner';

interface CreateTaskDialogProps {
  projectId: string;
  phases: { _id: string; title: string }[];
  teamMembers: { _id: string; name: string; email: string }[];
  taskStatuses: ITaskStatus[];
  onSuccess?: () => void;
  initialValues?: Partial<TaskFormStepData>;
  triggerButton?: React.ReactNode;
}

export default function CreateTaskForm({
  projectId,
  phases,
  teamMembers,
  taskStatuses,
  onSuccess,
  initialValues,
  triggerButton,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    currentStep,
    formData,
    defaultValues,
    isFirstStep,
    isLastStep,
    isSubmitting,
    steps,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    submitForm,
    resetForm,
    getCurrentStepSchema,
  } = useTaskForm({
    projectId,
    onSuccess: () => {
      setOpen(false);
      onSuccess?.();
    },
    initialValues,
  });

  const { reset, trigger, handleSubmit, control, getValues, setValue } =
    useForm<TaskFormStepData>({
      resolver: zodResolver(getCurrentStepSchema()),
      mode: 'onChange',
      defaultValues,
    });

  useEffect(() => {
    reset(formData);
  }, [currentStep, formData, reset]);

  async function onNext(data: TaskFormStepData) {
    const isValid = await trigger();
    if (!isValid) return;

    const updatedData = { ...formData, ...data };
    updateFormData(updatedData);

    if (isLastStep) {
      try {
        await submitForm(updatedData as TaskFormAllFields);
      } catch (error) {
        console.error('Submission failed:', error);
        toast.error('Submission failed');
      }
    } else {
      goToNextStep();
    }
  }

  function onPrevious() {
    return goToPreviousStep();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="w-max ml-auto mr-0 -mt-11">
            <Plus /> Create Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Create Task</DialogTitle>
        <TaskFormStepper currentStep={currentStep} />
        {currentStep === 0 && (
          <TaskDetailsStep
            getValues={getValues}
            setValue={setValue}
            control={control}
            phases={phases}
            teamMembers={teamMembers}
            taskStatuses={taskStatuses}
          />
        )}
        {currentStep === 1 && (
          <SubtaskStep
            teamMembers={teamMembers}
            setValue={setValue}
            control={control}
          />
        )}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstStep || isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onNext)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Submitting...
              </>
            ) : (
              <>
                {currentStep === 0 && (
                  <>
                    Add Subtasks <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
                {currentStep === 1 && 'Submit'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
