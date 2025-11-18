'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { IPhaseWithPopulatedTasks } from '@/types/project.types';
import { deletePhaseAction } from '@/actions/phase.actions';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface DeletePhaseDialogProps {
  projectId: string;
  phase: IPhaseWithPopulatedTasks;
}

export function DeletePhaseDialog({
  projectId,
  phase,
}: DeletePhaseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await deletePhaseAction(projectId, phase._id.toString());

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
      toast.error('Failed to delete phase');
    } finally {
      setIsDeleting(false);
    }
  }

  const taskCount = phase?.tasks?.length || 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          title="Delete phase"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone. This will permanently delete the
              phase{' '}
              <span className="font-semibold">&quot;{phase?.title}&quot;</span>{' '}
              and all its associated data.
            </p>
            <p className="text-sm">
              All tasks, subtasks, and comments within this phase will be
              permanently removed.
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Warning: This will also delete {taskCount}{' '}
              {taskCount === 1 ? 'task' : 'tasks'} associated with this phase.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Phase'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
