import { FolderOpen } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

function EmptyProjectsState() {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-muted">
          <FolderOpen className="text-muted-foreground" size={48} />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-2">
        No Projects Yet
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Get started by creating your first project to track
        <br /> your progress and collaborate with your team.
      </p>
      <Button asChild>
        <Link href="/create-project">Create Project</Link>
      </Button>
    </div>
  );
}

export default EmptyProjectsState;
