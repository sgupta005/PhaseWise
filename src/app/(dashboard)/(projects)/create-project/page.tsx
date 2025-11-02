'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProjectDetailsForm } from './components/ProjectDetailsForm';
import { PhasesForm } from './components/PhasesForm';
import {
  ProjectFormData,
  PhaseFormData,
  CreateProjectPayload,
} from '@/types/project';
import { useSession } from 'next-auth/react';

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();
  console.log(session);
  const userId = session?.user?.id;

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

  // Handlers for Project Details Form
  const handleProjectFormChange = (
    field: keyof ProjectFormData,
    value: any
  ) => {
    setProjectFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setStep1Errors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = (): boolean => {
    const errors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!projectFormData.title.trim()) {
      errors.title = 'Project title is required';
    }
    if (!projectFormData.description.trim()) {
      errors.description = 'Project description is required';
    }
    if (!projectFormData.techStack.trim()) {
      errors.techStack = 'Tech stack is required';
    }
    if (!projectFormData.githubLink.trim()) {
      errors.githubLink = 'GitHub repository URL is required';
    } else if (
      !projectFormData.githubLink.startsWith('http://') &&
      !projectFormData.githubLink.startsWith('https://')
    ) {
      errors.githubLink = 'Please enter a valid URL';
    }
    if (!projectFormData.faculty) {
      errors.faculty = 'Please select a faculty mentor';
    }
    if (projectFormData.teamMembers.length === 0) {
      errors.teamMembers = 'Please select at least one team member';
    }

    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  // Handlers for Phases Form
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

  const handleBack = () => {
    setCurrentStep(1);
  };

  const validateStep2 = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (phases.length === 0) {
      errors.general = 'Please add at least one phase';
      setStep2Errors(errors);
      return false;
    }

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      if (!phase.title.trim()) {
        errors.general = `Phase ${i + 1}: Title is required`;
        setStep2Errors(errors);
        return false;
      }
      if (!phase.deadline) {
        errors.general = `Phase ${i + 1}: Deadline is required`;
        setStep2Errors(errors);
        return false;
      }
      if (phase.tasks.length === 0) {
        errors.general = `Phase ${i + 1}: Please add at least one task`;
        setStep2Errors(errors);
        return false;
      }

      for (let j = 0; j < phase.tasks.length; j++) {
        const task = phase.tasks[j];
        if (!task.task.trim()) {
          errors.general = `Phase ${i + 1}, Task ${j + 1}: Description is required`;
          setStep2Errors(errors);
          return false;
        }
      }
    }

    setStep2Errors({});
    return true;
  };

  // Calculate progress for Step 1 (Project Details)
  const calculateStep1Progress = (): number => {
    let filledFields = 0;
    const totalRequiredFields = 6;

    if (projectFormData.title.trim()) filledFields++;
    if (projectFormData.description.trim()) filledFields++;
    if (projectFormData.techStack.trim()) filledFields++;
    if (projectFormData.githubLink.trim()) filledFields++;
    if (projectFormData.faculty) filledFields++;
    if (projectFormData.teamMembers.length > 0) filledFields++;

    return (filledFields / totalRequiredFields) * 100;
  };

  // Calculate progress for Step 2 (Phases)
  const calculateStep2Progress = (): number => {
    // Progress is 100% if there's at least one phase with title, deadline, and at least one task
    const hasCompletePhase = phases.some(
      (phase) =>
        phase.title.trim() !== '' &&
        phase.deadline !== '' &&
        phase.tasks.length > 0 &&
        phase.tasks.some((task) => task.task.trim() !== '')
    );
    return hasCompletePhase ? 100 : 0;
  };

  const handleSave = async () => {
    if (!validateStep2()) {
      toast.error('Please complete all phase information');
      return;
    }

    if (!userId) {
      toast.error('User session not found. Please refresh the page.');
      return;
    }

    setIsSaving(true);

    try {
      // Parse tech stack from comma-separated string to array
      const techStackArray = projectFormData.techStack
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean);

      // Build payload
      const payload: CreateProjectPayload = {
        title: projectFormData.title,
        description: projectFormData.description,
        githubLink: projectFormData.githubLink,
        projectUrl: projectFormData.projectUrl || undefined,
        techStack: techStackArray,
        isPublic: true,
        faculty: projectFormData.faculty!._id,
        teamMember: projectFormData.teamMembers.map((member) => member._id),
        createdBy: userId,
        phases: phases.map((phase, index) => ({
          title: phase.title,
          deadline: phase.deadline,
          currentPhase: index + 1,
          tasks: phase.tasks.map((task) => ({
            task: task.task,
            assignedTo: task.assignedTo,
            priority: task.priority,
          })),
        })),
      };

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

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Project
          </h1>
          <p className="text-muted-foreground mt-2">
            Step {currentStep} of 2:{' '}
            {currentStep === 1 ? 'Project Details' : 'Add Phases'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {/* Step 1 Progress */}
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${calculateStep1Progress()}%` }}
            />
          </div>
          {/* Step 2 Progress */}
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${calculateStep2Progress()}%` }}
            />
          </div>
        </div>

        {/* Forms */}
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
            onAddPhase={handleAddPhase}
            onUpdatePhase={handleUpdatePhase}
            onRemovePhase={handleRemovePhase}
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
