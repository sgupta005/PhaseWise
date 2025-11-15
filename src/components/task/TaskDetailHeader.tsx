'use client';

import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteTaskAction } from '@/actions/task.actions';
import { toast } from 'sonner';
import EditTaskDetailsForm from './EditTaskDetailsForm';
import { ITaskStatus } from '@/types/task.types';

interface TaskDetailHeaderProps {
  projectId: string;
  taskId: string;
  currentPhaseId: string;
  taskData: {
    task: string;
    priority: string;
    status: string;
    assignedTo: string[];
    dueDate?: string | null;
  };
  phases: { _id: string; title: string }[];
  teamMembers: { _id: string; name: string; email: string }[];
  taskStatuses: ITaskStatus[];
}

export default function TaskDetailHeader({
  projectId,
  taskId,
  currentPhaseId,
  taskData,
  phases,
  teamMembers,
  taskStatuses,
}: TaskDetailHeaderProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteConfirm() {
    setIsDeleting(true);

    try {
      const result = await deleteTaskAction(taskId, projectId);

      if (result.success) {
        toast.success(result.message || 'Task deleted successfully');
        router.push(`/projects/${projectId}/tasks`);
      } else {
        toast.error(result.message || 'Failed to delete task');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('An unexpected error occurred');
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <EditTaskDetailsForm
            taskId={taskId}
            projectId={projectId}
            currentPhaseId={currentPhaseId}
            taskData={taskData}
            phases={phases}
            teamMembers={teamMembers}
            taskStatuses={taskStatuses}
          />
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive">
                <Trash2 className="size-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  task and all of its subtasks and comments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteConfirm();
                  }}
                  disabled={isDeleting}
                  className={buttonVariants({ variant: 'destructive' })}
                >
                  {isDeleting ? (
                    <>
                      <Spinner className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
