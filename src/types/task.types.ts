// Base Types

import { TaskDocument } from '@/models/task.model';
import { UserDocument } from '@/models/user.model';

export interface ITaskStatus {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface ITask extends Omit<TaskDocument, 'assignedTo' | 'createdBy'> {
  assignedTo: UserDocument[];
  createdBy: UserDocument;
  phaseId: string;
  phaseTitle: string;
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
