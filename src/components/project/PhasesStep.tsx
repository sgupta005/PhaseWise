import { Plus, Trash2 } from 'lucide-react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormReturn,
} from 'react-hook-form';
import { useWatch, UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { ProjectFormStepData, Phases } from '@/schemas/project-form.schema';
import PhaseTaskForm from '@/components/phase/PhaseTaskForm';
import AIPhaseGenerator from './AIPhaseGenerator';

interface PhasesStepProps {
  errors: FieldErrors<Phases>;
  form: UseFormReturn<ProjectFormStepData>;
  control: Control<ProjectFormStepData>;
  setValue: UseFormSetValue<ProjectFormStepData>;
}

export default function PhasesStep({
  errors,
  form,
  control,
  setValue,
}: PhasesStepProps) {
  const phases = useWatch({
    control,
    name: 'phases',
    defaultValue: [],
  });

  const [title, description, techStack] = useWatch({
    control,
    name: ['title', 'description', 'techStack'],
  });

  function handleAddPhase() {
    const currentPhases = phases || [];
    setValue('phases', [
      ...currentPhases,
      { title: '', deadline: '', tasks: [] },
    ]);
    form.clearErrors('phases');
  }

  function handleRemovePhase(e: React.MouseEvent, index: number) {
    e.stopPropagation(); // prevent opening accordion when delte button is clicked
    const currentPhases = phases || [];
    setValue(
      'phases',
      currentPhases.filter((_, i) => i !== index)
    );
  }

  function handlePhasesGenerated(generatedPhases: typeof phases) {
    const currentPhases = phases || [];
    // Merge AI-generated phases with existing manually created phases
    setValue('phases', [...currentPhases, ...generatedPhases]);
    form.clearErrors('phases');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            Phases <span className="text-destructive font-normal">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Break down your Project into Phases
          </p>
        </div>
        <div className="flex items-center justify-self-end gap-2">
          <Button type="button" variant="outline" onClick={handleAddPhase}>
            <Plus className="h-4 w-4 mr-2" />
            Add Phase
          </Button>
          <AIPhaseGenerator
            title={title || ''}
            description={description || ''}
            techStack={techStack || ''}
            onPhasesGenerated={handlePhasesGenerated}
          />
        </div>
      </div>

      {!phases || phases.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">
            No phases yet. Add a Phase to get started.
          </p>
          <Button type="button" onClick={handleAddPhase}>
            <Plus className="h-4 w-4 mr-2" />
            Add Phase
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Accordion type="single" collapsible defaultValue={`phase-0`}>
            {phases.map((phase, index) => (
              <AccordionItem key={index} value={`phase-${index}`}>
                <AccordionTrigger className="flex-1 text-base hover:no-underline py-4 font-semibold items-center">
                  <div className="flex items-center w-full">
                    <span>{`Phase ${index + 1}${phase.title ? ':' : ''}  ${phase.title}`}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleRemovePhase(e, index)}
                      className="text-destructive hover:text-destructive ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phase Title */}
                    <Controller
                      name={`phases.${index}.title`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Phase Title{' '}
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="e.g., Planning and Design"
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
                      name={`phases.${index}.deadline`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Phase Deadline{' '}
                            <span className="text-destructive">*</span>
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
                  </div>

                  <div className="mt-4">
                    <PhaseTaskForm
                      control={control}
                      setValue={setValue}
                      teamMembers={[]} // TODO: Fetch team members
                      tasksFieldPath={`phases.${index}.tasks`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
      {errors.phases && typeof errors.phases.message === 'string' && (
        <div className="text-sm text-destructive mt-2">
          Please add at least one phase
        </div>
      )}
    </div>
  );
}
