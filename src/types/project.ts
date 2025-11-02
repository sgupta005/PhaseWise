import { Types } from 'mongoose';

// ==================== Base Types ====================

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  image?: string | null;
}

export interface ITask {
  _id?: string;
  task: string;
  assignedTo: string[]; // Array of user IDs
  priority: 'Low Priority' | 'Medium Priority' | 'High Priority' | 'Urgent';
}

export interface IPhase {
  _id?: string;
  title: string;
  deadline: string | Date;
  currentPhase: number;
  tasks: ITask[];
}

export interface IProject {
  _id?: string;
  title: string;
  description?: string;
  githubLink: string;
  projectUrl?: string;
  techStack: string[];
  isPublic: boolean;
  teamMember: string[]; // Array of user IDs
  faculty: string; // User ID
  phases: string[]; // Array of phase IDs (when fetched from DB)
  createdBy: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
}

// ==================== Populated Types (for displaying data) ====================

export interface ITaskPopulated extends Omit<ITask, 'assignedTo'> {
  assignedTo: IUser[];
}

export interface IPhasePopulated extends Omit<IPhase, 'tasks'> {
  tasks: ITaskPopulated[];
}

export interface IProjectPopulated
  extends Omit<IProject, 'phases' | 'teamMember' | 'faculty' | 'createdBy'> {
  phases: IPhasePopulated[];
  teamMember: IUser[];
  faculty: IUser;
  createdBy: IUser;
}

// ==================== Form Data Types ====================

export interface ProjectFormData {
  title: string;
  description: string;
  githubLink: string;
  projectUrl: string;
  techStack: string; // Comma-separated string (converted to array before submission)
  faculty: IUser | null; // Selected faculty object
  teamMembers: IUser[]; // Selected team members
}

export interface TaskFormData {
  id: string; // Temporary ID for form management (using Date.now() or uuid)
  task: string;
  assignedTo: string[]; // Array of selected user IDs from team
  priority: 'Low Priority' | 'Medium Priority' | 'High Priority' | 'Urgent';
}

export interface PhaseFormData {
  id: string; // Temporary ID for form management
  title: string;
  deadline: string; // ISO date string
  tasks: TaskFormData[];
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  githubLink?: string;
  projectUrl?: string;
  techStack: string[];
  isPublic: boolean;
  teamMember: string[]; // User IDs
  faculty: string; // User ID
  createdBy: string; // Current user ID
  phases: {
    title: string;
    deadline: string;
    currentPhase: number;
    tasks: {
      task: string;
      assignedTo: string[];
      priority: string;
    }[];
  }[];
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ProjectApiResponse {
  success: boolean;
  message: string;
  project?: IProject;
  data?: IProject | IProject[] | IProjectPopulated;
}

// ==================== AI Generation Types ====================

export interface AIGeneratedTask {
  task: string;
  priority: 'Low Priority' | 'Medium Priority' | 'High Priority' | 'Urgent';
}

export interface AIGeneratedPhase {
  title: string;
  deadline: string; // Relative deadline like "+7 days" or "+2 weeks"
  tasks: AIGeneratedTask[];
}

export interface AIGenerateRequest {
  title: string;
  description: string;
  techStack: string[];
}

export interface AIGenerateResponse {
  success: boolean;
  phases?: AIGeneratedPhase[];
  error?: string;
}
