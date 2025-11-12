import {
  taskDetailsSchema,
  subtaskSchema,
  TaskFormStepData,
  TaskFormAllFields,
} from '@/schemas/task-form.schema';
import { useState } from 'react';
import { createTaskAction } from '@/actions/task.actions';
import { toast } from 'sonner';

const stepSchemas = [taskDetailsSchema, subtaskSchema];

interface Step {
  id: string;
  name: string;
}

export const steps: Step[] = [
  { id: 'task-details', name: 'Task Details' },
  { id: 'subtasks', name: 'Subtasks' },
];

interface UseTaskFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export function useTaskForm({ projectId, onSuccess }: UseTaskFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<Partial<TaskFormStepData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<TaskFormStepData> =
    currentStep === 0
      ? {
          phaseId: '',
          task: '',
          assignedTo: [],
          priority: 'Low Priority' as const,
          status: '',
          dueDate: '',
        }
      : {
          subtasks: [],
        };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const getCurrentStepSchema = () => stepSchemas[currentStep];

  const goToNextStep = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  const updateFormData = (newData: Partial<TaskFormStepData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  async function submitForm(data: TaskFormAllFields) {
    setIsSubmitting(true);
    try {
      const payload: TaskFormAllFields = {
        phaseId: data.phaseId,
        task: data.task,
        assignedTo: data.assignedTo,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate,
        subtasks: data.subtasks || [],
      };

      const result = await createTaskAction(projectId, payload);

      if (result.success) {
        toast.success(result.message || 'Task created successfully');
        resetForm();
        onSuccess?.();
      } else {
        toast.error(result.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const resetForm = () => {
    setFormData({});
    setCurrentStep(0);
  };

  return {
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
  };
}
