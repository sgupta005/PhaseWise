'use client';

import { ProjectDetailsForm } from '@/components/project/ProjectDetailsForm';
import { PhasesForm } from '@/components/project/PhasesForm';
import { StepHeader } from '@/components/project/StepHeader';
import { ProgressIndicator } from '@/components/project/ProgressIndicator';
import { useCreateProject } from '@/hooks/project/useCreateProject';
import {
  calculateStep1Progress,
  calculateStep2Progress,
} from '@/lib/project/progress-calculator';

export default function CreateProjectPage() {
  const {
    currentStep,
    isSaving,
    projectFormData,
    phases,
    step1Errors,
    step2Errors,
    handleProjectFormChange,
    handleNext,
    handleAddPhase,
    handleUpdatePhase,
    handleRemovePhase,
    handlePhasesGenerated,
    handleBack,
    handleSave,
  } = useCreateProject();

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <StepHeader currentStep={currentStep} />
        <ProgressIndicator
          step1Progress={calculateStep1Progress(projectFormData)}
          step2Progress={calculateStep2Progress(phases)}
        />
        {currentStep === 1 ? (
          <ProjectDetailsForm
            formData={projectFormData}
            onChange={handleProjectFormChange}
            onNext={handleNext}
            errors={step1Errors}
          />
        ) : (
          <PhasesForm
            phases={phases}
            teamMembers={projectFormData.teamMembers}
            projectTitle={projectFormData.title}
            projectDescription={projectFormData.description}
            techStack={projectFormData.techStack
              .split(',')
              .map((tech) => tech.trim())
              .filter(Boolean)}
            onAddPhase={handleAddPhase}
            onUpdatePhase={handleUpdatePhase}
            onRemovePhase={handleRemovePhase}
            onPhasesGenerated={handlePhasesGenerated}
            onBack={handleBack}
            onSave={handleSave}
            isSaving={isSaving}
            errors={step2Errors}
          />
        )}
      </div>
    </div>
  );
}
