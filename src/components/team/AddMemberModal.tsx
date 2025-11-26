'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMemberSelector } from '@/components/selectors/TeamMemberSelector';
import { Spinner } from '@/components/ui/spinner';
import { GraduationCap, Users } from 'lucide-react';
import { MultiFacultySelector } from '../selectors/MultiFacultySelector';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMembers: (
    memberIds: string[],
    role: 'faculty' | 'student'
  ) => Promise<void>;
  existingFacultyIds: string[];
  existingStudentIds: string[];
}

export function AddMemberModal({
  open,
  onOpenChange,
  onAddMembers,
  existingFacultyIds,
  existingStudentIds,
}: AddMemberModalProps) {
  const [selectedFacultyIds, setSelectedFacultyIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'faculty' | 'student'>('student');

  async function handleAddFaculty() {
    const newFacultyIds = selectedFacultyIds.filter(
      (id) => !existingStudentIds.includes(id)
    );
    if (newFacultyIds.length === 0) return;

    setIsLoading(true);
    try {
      await onAddMembers(newFacultyIds, 'faculty');
      setSelectedFacultyIds([]);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddStudents() {
    const newStudentIds = selectedStudentIds.filter(
      (id) => !existingStudentIds.includes(id)
    );
    if (newStudentIds.length === 0) return;

    setIsLoading(true);
    try {
      await onAddMembers(newStudentIds, 'student');
      setSelectedStudentIds([]);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setSelectedFacultyIds([]);
    setSelectedStudentIds([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new faculty mentor or student to the project.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'faculty' | 'student')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="gap-2">
              <Users className="h-4 w-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="faculty" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Faculty
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Students</label>
              <TeamMemberSelector
                value={selectedStudentIds}
                onChange={setSelectedStudentIds}
                placeholder="Search and select students..."
              />
              <p className="text-xs text-muted-foreground">
                Select one or more students to add to the project.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="faculty" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Faculty</label>
              <MultiFacultySelector
                value={selectedFacultyIds}
                onChange={setSelectedFacultyIds}
              />
              <p className="text-xs text-muted-foreground">
                Add a faculty mentor to oversee the project.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          {activeTab === 'student' ? (
            <Button
              onClick={handleAddStudents}
              disabled={
                isLoading ||
                selectedStudentIds.filter(
                  (id) => !existingStudentIds.includes(id)
                ).length === 0
              }
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                'Add Students'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleAddFaculty}
              disabled={
                isLoading ||
                isLoading ||
                selectedFacultyIds.filter(
                  (id) => !existingFacultyIds.includes(id)
                ).length === 0
              }
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                'Add Faculty'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
