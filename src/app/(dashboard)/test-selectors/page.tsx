'use client';

import { useState } from 'react';
import { FacultySelector } from '@/components/selectors/FacultySelector';
import { TeamMemberSelector } from '@/components/selectors/TeamMemberSelector';
import { IUser } from '@/types/project';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';

export default function TestSelectorsPage() {
  const [selectedFaculty, setSelectedFaculty] = useState<IUser | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<IUser[]>([]);

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Selector Components Test
          </h1>
          <p className="text-muted-foreground mt-2">
            Test the Faculty and Team Member selector components
          </p>
        </div>

        {/* Selectors Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Selectors</CardTitle>
            <CardDescription>
              Select a faculty member and team members from the dropdowns below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Faculty Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Faculty Mentor <span className="text-destructive">*</span>
              </label>
              <FacultySelector
                value={selectedFaculty}
                onChange={setSelectedFaculty}
              />
              <p className="text-xs text-muted-foreground">
                Select the faculty member who will mentor this project
              </p>
            </div>

            {/* <Separator /> */}

            {/* Team Member Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Team Members <span className="text-destructive">*</span>
              </label>
              <TeamMemberSelector
                value={selectedTeamMembers}
                onChange={setSelectedTeamMembers}
                placeholder="Select students for your team..."
              />
              <p className="text-xs text-muted-foreground">
                Select one or more students who will work on this project
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Values Display */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Values (Debug)</CardTitle>
            <CardDescription>Current state of selected users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Faculty Display */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Selected Faculty:</h3>
              {selectedFaculty ? (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-medium">{selectedFaculty.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedFaculty.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {selectedFaculty._id}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No faculty selected
                </p>
              )}
            </div>

            {/* <Separator /> */}

            {/* Team Members Display */}
            <div>
              <h3 className="text-sm font-semibold mb-2">
                Selected Team Members: ({selectedTeamMembers.length})
              </h3>
              {selectedTeamMembers.length > 0 ? (
                <div className="space-y-2">
                  {selectedTeamMembers.map((member) => (
                    <div key={member._id} className="p-3 rounded-lg bg-muted">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {member._id}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No team members selected
                </p>
              )}
            </div>

            {/* <Separator /> */}

            {/* JSON Output */}
            <div>
              <h3 className="text-sm font-semibold mb-2">
                JSON Output (for API):
              </h3>
              <pre className="p-3 rounded-lg bg-muted text-xs overflow-x-auto">
                {JSON.stringify(
                  {
                    faculty: selectedFaculty?._id || null,
                    teamMembers: selectedTeamMembers.map((m) => m._id),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
