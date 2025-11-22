import { ProjectDocument } from '@/models/project.model';
import { UserDocument } from '@/models/user.model';
import { TaskDocument } from '@/models/task.model';
import { PhaseDocument } from '@/models/phase.model';

//  Populated Types (for displaying data)

export interface IProjectWithTeam
  extends Omit<ProjectDocument, 'teamMember' | 'faculty' | 'createdBy'> {
  teamMember: UserDocument[];
  faculty: UserDocument;
  createdBy: UserDocument;
}

export interface IProjectPopulated
  extends Omit<
    ProjectDocument,
    'teamMember' | 'faculty' | 'createdBy' | 'phases'
  > {
  teamMember: UserDocument[];
  faculty: UserDocument;
  createdBy: UserDocument;
  phases: IPhaseWithPopulatedTasks[];
}
export interface IPhaseWithPopulatedTasks extends Omit<PhaseDocument, 'tasks'> {
  tasks: IPopulatedTask[];
}
export interface IPopulatedTask
  extends Omit<TaskDocument, 'assignedTo' | 'createdBy'> {
  assignedTo: UserDocument[];
  createdBy: UserDocument;
}

export interface IProjectWithTasks extends Omit<ProjectDocument, 'phases'> {
  phases: IPhaseWithTasks[];
}
export interface IPhaseWithTasks extends Omit<PhaseDocument, 'tasks'> {
  tasks: TaskDocument[];
}

// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ProjectApiResponse {
  success: boolean;
  message: string;
  project?: ProjectDocument;
  data?: ProjectDocument | ProjectDocument[];
}

// AI Generation Types

export interface AIGeneratedTask {
  task: string;
  priority: 'Low Priority' | 'Medium Priority' | 'High Priority' | 'Urgent';
  dueDate?: string | null; // Relative deadline like "+3 days" or "+1 week"
}

export interface AIGeneratedPhase {
  title: string;
  deadline: string; // Relative deadline like "+7 days" or "+2 weeks"
  tasks: AIGeneratedTask[];
}

export interface AIGenerateRequest {
  title: string;
  description: string;
  techStack: string;
}

export interface AIGenerateResponse {
  success: boolean;
  phases?: AIGeneratedPhase[];
  error?: string;
}
