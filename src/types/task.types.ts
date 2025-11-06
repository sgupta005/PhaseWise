// Base Types

export interface ITaskStatus {
  id: string;
  name: string;
  isDefault: boolean;
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
