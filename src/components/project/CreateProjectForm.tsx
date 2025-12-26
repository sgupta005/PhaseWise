'use client';

import { useProjectForm } from '@/hooks/project/useProjectForm';
import {
  ProjectFormAllFields,
  ProjectFormStepData,
} from '@/schemas/project-form.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ProjectDetailsStep from './ProjectDetailsStep';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import PhasesStep from './PhasesStep';
import { FormStepper } from '@/components/FormStepper';
import { ProgressIndicator } from './ProgressIndicator';
import { calculateProjectProgress } from '@/lib/project/progress-calculator';

export default function CreateProjectForm() {
  const {
    currentStep,
    formData,
    defaultValues,
    isFirstStep,
    isLastStep,
    isSubmitting,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    submitForm,
    getCurrentStepSchema,
  } = useProjectForm();

  const form = useForm<ProjectFormStepData>({
    resolver: zodResolver(getCurrentStepSchema()),
    mode: 'onChange',
    defaultValues,
  });
  const {
    reset,
    trigger,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset(formData);
  }, [currentStep, formData, reset]);

  async function onNext() {
    const isValid = await trigger();
    if (!isValid) return;
    // Save current form data before going to next step
    const currentFormData = getValues();
    const updatedData = { ...formData, ...currentFormData };
    updateFormData(updatedData);

    if (isLastStep) {
      try {
        await submitForm(updatedData as ProjectFormAllFields);
      } catch (error) {
        console.error('Submission failed:', error);
        toast.error('Submission failed');
      }
    } else {
      goToNextStep();
    }
  }

  function onPrevious() {
    // Save current form data before going back
    const currentFormData = getValues();
    const updatedData = { ...formData, ...currentFormData };
    updateFormData(updatedData);
    return goToPreviousStep();
  }

  const watchedValues = form.watch();
  const { step1Progress, step2Progress } = calculateProjectProgress(
    formData,
    watchedValues,
    currentStep
  );

  return (
    <div className="flex flex-col gap-8 max-w-3xl w-full mx-auto py-4 ">
      <FormStepper
        currentStep={currentStep}
        steps={['Project Details', 'Phases']}
      />
      <ProgressIndicator
        step1Progress={step1Progress}
        step2Progress={step2Progress}
      />
      <div className="flex flex-col gap-8 lg:border px-6 md:p-6 rounded-lg">
        {currentStep === 0 ? (
          <ProjectDetailsStep control={control} />
        ) : (
          <PhasesStep
            form={form}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        )}
        <div className="flex justify-between">
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
                    Add Phases <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
                {currentStep === 1 && 'Submit'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
