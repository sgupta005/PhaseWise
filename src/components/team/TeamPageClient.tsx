'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IProjectWithTeam } from '@/types/project.types';
import { TeamMemberCard } from './TeamMemberCard';
import { AddMemberModal } from './AddMemberModal';
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
import { UserPlus, LogOut, GraduationCap, Users } from 'lucide-react';
import {
  addTeamMemberAction,
  removeTeamMemberAction,
  leaveProjectAction,
} from '@/actions/team.actions';
import { toast } from 'sonner';

interface TeamPageClientProps {
  project: IProjectWithTeam;
}

export function TeamPageClient({ project }: TeamPageClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentUserId = session?.user?.id;
  const isCreator = project.createdBy._id.toString() === currentUserId;
  const isFaculty = project.faculty.some(
    (f) => f._id.toString() === currentUserId
  );
  const canManage = isCreator || isFaculty;

  // Check if current user is a member of the project
  const isTeamMember = project.teamMember.some(
    (m) => m._id.toString() === currentUserId
  );
  const isMember = isTeamMember || isFaculty;

  async function handleAddMembers(
    memberIds: string[],
    role: 'faculty' | 'student'
  ) {
    startTransition(async () => {
      let successCount = 0;
      let failCount = 0;

      for (const memberId of memberIds) {
        const result = await addTeamMemberAction(
          project._id.toString(),
          memberId,
          role
        );
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} member(s) added/invited successfully`);
        router.refresh();
      }
      if (failCount > 0) {
        toast.error(`Failed to add ${failCount} member(s)`);
      }
    });
  }

  async function handleRemoveMember(memberId: string) {
    setRemovingMemberId(memberId);
    startTransition(async () => {
      const result = await removeTeamMemberAction(
        project._id.toString(),
        memberId
      );
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setRemovingMemberId(null);
    });
  }

  async function handleLeaveProject() {
    startTransition(async () => {
      const result = await leaveProjectAction(project._id.toString());
      if (result.success) {
        toast.success(result.message);
        router.push('/projects');
      } else {
        toast.error(result.message);
      }
    });
  }

  const existingFacultyIds = project.faculty.map((f) => f._id.toString());
  const existingStudentIds = project.teamMember.map((m) => m._id.toString());

  return (
    <div className="max-w-7xl mx-auto px-6 py-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            Manage the team for {project.title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isMember && (
            <AlertDialog>
              <AlertDialogTrigger
                className={buttonVariants({ variant: 'destructive' })}
              >
                <>
                  <LogOut className="h-4 w-4" />
                  Leave Project
                </>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave this project?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave{' '}
                    <span className="font-semibold">{project.title}</span>? You
                    will lose access to the project and all its tasks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveProject}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Leave Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {canManage && (
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>
      </div>

      {/* Faculty Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 " />
          <h2 className="text-lg font-semibold">Faculty</h2>
          <span className="text-sm text-muted-foreground">
            ({project.faculty.length})
          </span>
        </div>
        {project.faculty.length === 0 ? (
          <div className="border border-dashed rounded-lg p-8 text-center">
            <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No faculty mentors assigned</p>
            {canManage && (
              <Button
                variant="link"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2"
              >
                Add a faculty mentor
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {project.faculty.map((faculty) => (
              <TeamMemberCard
                canBeRemoved={isFaculty}
                key={faculty._id.toString()}
                member={faculty}
                role="faculty"
                isCreator={
                  project.createdBy._id.toString() === faculty._id.toString()
                }
                canManage={canManage}
                onRemove={() => handleRemoveMember(faculty._id.toString())}
                isRemoving={removingMemberId === faculty._id.toString()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Team Members Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 " />
          <h2 className="text-lg font-semibold">Team Members</h2>
          <span className="text-sm text-muted-foreground">
            ({project.teamMember.length})
          </span>
        </div>
        {project.teamMember.length === 0 ? (
          <div className="border border-dashed rounded-lg p-8 text-center">
            {/* <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" /> */}
            <p className="text-muted-foreground">No team members yet</p>
            {canManage && (
              <Button
                variant="link"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2"
              >
                Add team members
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {project.teamMember.map((member) => (
              <TeamMemberCard
                canBeRemoved={isFaculty || isCreator}
                key={member._id.toString()}
                member={member}
                role="student"
                isCreator={
                  project.createdBy._id.toString() === member._id.toString()
                }
                canManage={canManage}
                onRemove={() => handleRemoveMember(member._id.toString())}
                isRemoving={removingMemberId === member._id.toString()}
              />
            ))}
          </div>
        )}
      </div>

      <AddMemberModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddMembers={handleAddMembers}
        existingFacultyIds={existingFacultyIds}
        existingStudentIds={existingStudentIds}
      />
    </div>
  );
}
