// Base Types

export interface ITaskStatus {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface ITask {
  _id?: string;
  task: string;
  assignedTo: string[]; // Array of user IDs
  priority: 'Low Priority' | 'Medium Priority' | 'High Priority' | 'Urgent';
  status: string; // Status ID
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
