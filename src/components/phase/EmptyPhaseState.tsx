import { UserDocument } from '@/models/user.model';
import { CreatePhaseForm } from './CreatePhaseForm';

interface EmptyPhaseStateProps {
  projectId: string;
  teamMembers: UserDocument[];
}
export function EmptyPhaseState({
  projectId,
  teamMembers,
}: EmptyPhaseStateProps) {
  return (
    <div className="px-6 py-4 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Phases</h1>
          <p className="text-muted-foreground mt-1">
            Manage project phases and track progress
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold">No phases yet</h3>
          <p className="text-muted-foreground max-w-md">
            Get started by creating your first phase. Break down your project
            into manageable stages with specific tasks and deadlines.
          </p>
          <CreatePhaseForm projectId={projectId} teamMembers={teamMembers} />
        </div>
      </div>
    </div>
  );
}
