'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ProjectFormData, PhaseFormData } from '@/types/project.types';
import { validateProjectDetails, validatePhases } from '../utils/validation';
import { buildProjectPayload } from '../utils/payload-builder';

export function useCreateProject() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Project Details
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    projectUrl: '',
    faculty: null,
    teamMembers: [],
  });

  const [step1Errors, setStep1Errors] = useState<
    Partial<Record<keyof ProjectFormData, string>>
  >({});

  // Step 2: Phases
  const [phases, setPhases] = useState<PhaseFormData[]>([]);
  const [step2Errors, setStep2Errors] = useState<{ [key: string]: string }>({});

  // Project form handlers
  const handleProjectFormChange = (
    field: keyof ProjectFormData,
    value: any
  ) => {
    setProjectFormData((prev) => ({ ...prev, [field]: value }));
    setStep1Errors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleNext = () => {
    const errors = validateProjectDetails(projectFormData);
    setStep1Errors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentStep(2);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  // Phase handlers
  const handleAddPhase = () => {
    const newPhase: PhaseFormData = {
      id: `phase-${Date.now()}`,
      title: '',
      deadline: '',
      tasks: [],
    };
    setPhases([...phases, newPhase]);
  };

  const handleUpdatePhase = (index: number, updatedPhase: PhaseFormData) => {
    const newPhases = [...phases];
    newPhases[index] = updatedPhase;
    setPhases(newPhases);
  };

  const handleRemovePhase = (index: number) => {
    setPhases(phases.filter((_, idx) => idx !== index));
  };

  const handlePhasesGenerated = (generatedPhases: PhaseFormData[]) => {
    setPhases(generatedPhases);
    toast.success('Phases generated! You can edit them before saving.');
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // Save project
  const handleSave = async () => {
    const errors = validatePhases(phases);
    setStep2Errors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error(errors.general || 'Please complete all phase information');
      return;
    }

    if (!userId) {
      toast.error('User session not found. Please refresh the page.');
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildProjectPayload(projectFormData, phases, userId);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Project created successfully!');
        router.push('/projects');
      } else {
        toast.error(data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('An error occurred while creating the project');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // State
    currentStep,
    isSaving,
    projectFormData,
    phases,
    step1Errors,
    step2Errors,
    userId,

    // Handlers
    handleProjectFormChange,
    handleNext,
    handleAddPhase,
    handleUpdatePhase,
    handleRemovePhase,
    handlePhasesGenerated,
    handleBack,
    handleSave,
  };
}
