'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TaskDetailHeaderProps {
  projectId: string;
  taskId: string;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
}

export default function TaskDetailHeader({
  projectId,
  taskId,
  isEditMode,
  onToggleEdit,
  onDelete,
}: TaskDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
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
        <Button
          variant={isEditMode ? 'secondary' : 'outline'}
          onClick={onToggleEdit}
        >
          <Edit className="size-4" />
          {isEditMode ? 'View Mode' : 'Edit Mode'}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
