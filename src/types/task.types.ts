// Base Types

import { TaskDocument } from '@/models/task.model';
import { UserDocument } from '@/models/user.model';
import { SubtaskDocument } from '@/models/subtask.model';
import { CommentDocument } from '@/models/comment.model';

export interface ITaskStatus {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface ITaskWithTeam
  extends Omit<TaskDocument, 'assignedTo' | 'createdBy'> {
  assignedTo: UserDocument[];
  createdBy: UserDocument;
  phaseId: string;
  phaseTitle: string;
}

export interface ITaskDetailed
  extends Omit<
    TaskDocument,
    'assignedTo' | 'createdBy' | 'subtasks' | 'comments'
  > {
  assignedTo: UserDocument[];
  createdBy: UserDocument;
  subtasks: (SubtaskDocument & { createdBy: UserDocument })[];
  comments: (CommentDocument & { createdBy: UserDocument })[];
}

// Task Status Management Types

export interface CreateStatusPayload {
  name: string;
}

export interface UpdateStatusPayload {
  id: string;
  name: string;
}

export interface DeleteStatusPayload {
  id: string;
}

export interface SetDefaultStatusPayload {
  id: string;
}

export interface StatusOperationResponse {
  success: boolean;
  message: string;
  status?: ITaskStatus;
  statuses?: ITaskStatus[];
}

// Kanban Board Types
export type GroupByMode = 'status' | 'priority';

export interface TaskUpdateResponse {
  success: boolean;
  message: string;
  task?: ITaskWithTeam;
}
