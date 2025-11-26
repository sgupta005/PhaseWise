'use client';

import { UserDocument } from '@/models/user.model';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Crown, GraduationCap, User, Ghost } from 'lucide-react';
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
import { getInitials } from '@/lib/utils/avatar';

interface TeamMemberCardProps {
  canBeRemoved: boolean;
  member: UserDocument;
  role: 'faculty' | 'student';
  isCreator: boolean;
  canManage: boolean;
  onRemove?: () => void;
  isRemoving?: boolean;
}

export function TeamMemberCard({
  canBeRemoved,
  member,
  role,
  isCreator,
  canManage,
  onRemove,
  isRemoving,
}: TeamMemberCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.image || undefined} alt={member.name} />
          <AvatarFallback>{getInitials(member?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium">{member.name}</span>
            {isCreator && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Crown className="h-3 w-3" />
                Creator
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{member.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={role === 'faculty' ? 'default' : 'secondary'}>
          {role === 'faculty' ? (
            <>
              <GraduationCap className="h-3 w-3 mr-1" />
              Faculty
            </>
          ) : (
            <>
              <User className="h-3 w-3 mr-1" />
              Student
            </>
          )}
        </Badge>
        {canBeRemoved && onRemove && !isCreator && (
          <AlertDialog>
            <AlertDialogTrigger
              className={
                (buttonVariants({ variant: 'ghost', size: 'icon' }),
                'hover:text-destructive text-destructive')
              }
            >
              <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove team member?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove{' '}
                  <span className="font-semibold">{member.name}</span> from the
                  project? They will no longer have access to the project.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isRemoving}
                  onClick={onRemove}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
