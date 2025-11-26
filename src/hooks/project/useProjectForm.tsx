import { createProjectAction } from '@/actions/project.actions';
import {
  phaseSchema,
  projectDetailsSchema,
  ProjectFormAllFields,
  ProjectFormStepData,
} from '@/schemas/project-form.schema';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const stepSchemas = [projectDetailsSchema, phaseSchema];

interface Step {
  id: string;
  name: string;
}

export const steps: Step[] = [
  { id: 'project-details', name: 'Project Details' },
  { id: 'phases', name: 'Phases' },
];

export function useProjectForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<Partial<ProjectFormStepData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const defaultValues: Partial<ProjectFormStepData> =
    currentStep === 0
      ? {
          title: '',
          description: '',
          techStack: '',
          githubLink: undefined,
          projectUrl: undefined,
          facultyIds: [],
          teamMemberIds: [],
        }
      : {
          phases: [],
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

  const updateFormData = (newData: Partial<ProjectFormStepData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  async function submitForm(data: ProjectFormAllFields) {
    setIsSubmitting(true);
    try {
      const payload: ProjectFormAllFields = {
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        githubLink: data.githubLink,
        projectUrl: data.projectUrl,
        facultyIds: data.facultyIds,
        teamMemberIds: data.teamMemberIds,
        phases: data.phases,
      };

      const result = await createProjectAction(payload);

      if (result.success) {
        router.push(`/projects/${result.projectId}`);
        toast.success(result.message || 'Project created successfully');
      } else {
        toast.error(result.message || 'Failed to create project');
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
