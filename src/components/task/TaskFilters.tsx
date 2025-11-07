'use client';

import { IProjectPopulated } from '@/types/project.types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { RefreshCcw, Search } from 'lucide-react';

export default function TaskFilters({
  project,
}: {
  project: IProjectPopulated;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );

  const updateSearchParam = useCallback(
    function (key: string, value: string) {
      const params = new URLSearchParams(searchParams.toString());

      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  function clearAllFilters() {
    setSearchValue('');
    router.push(window.location.pathname, { scroll: false });
  }

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearchParam('search', searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, updateSearchParam]);

  const currentPhase = searchParams.get('phase') || 'all';
  const currentAssignee = searchParams.get('assignee') || 'all';
  const currentPriority = searchParams.get('priority') || 'all';
  const currentCreatedBy = searchParams.get('createdBy') || 'all';
  const currentStatus = searchParams.get('status') || 'all';

  return (
    <div className="flex gap-2 mb-4">
      <div className="relative max-w-[180px]">
        <Input
          placeholder="Search tasks..."
          className="pr-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      <Select
        value={currentPhase}
        onValueChange={(value) => updateSearchParam('phase', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a phase" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Phases</SelectLabel>
            <SelectItem value="all">All Phases</SelectItem>
            {project.phases.map((phase) => (
              <SelectItem
                key={phase._id.toString()}
                value={phase._id.toString()}
              >
                {phase.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={currentAssignee}
        onValueChange={(value) => updateSearchParam('assignee', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Assigned To" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Assigned To</SelectLabel>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="none">Unassigned</SelectItem>
            {project.teamMember.map((member) => (
              <SelectItem
                key={member._id.toString()}
                value={member._id.toString()}
              >
                {member.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={currentPriority}
        onValueChange={(value) => updateSearchParam('priority', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={currentCreatedBy}
        onValueChange={(value) => updateSearchParam('createdBy', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Created By" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Created By</SelectLabel>
            <SelectItem value="all">All Creators</SelectItem>
            <SelectItem
              key={project.faculty._id.toString()}
              value={project.faculty._id.toString()}
            >
              {project.faculty.name} (Faculty)
            </SelectItem>
            {project.teamMember.map((member) => (
              <SelectItem
                key={member._id.toString()}
                value={member._id.toString()}
              >
                {member.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={currentStatus}
        onValueChange={(value) => updateSearchParam('status', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All Statuses</SelectItem>
            {project.taskStatuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={clearAllFilters}>
        <RefreshCcw className="size-4" />
      </Button>
    </div>
  );
}
