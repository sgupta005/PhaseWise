'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { ITask } from '@/types/task.types';
import { Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPriority } from '@/lib/task/formatters';

export const columns: ColumnDef<ITask>[] = [
  {
    accessorKey: 'task',
    header: 'Title',
    cell: ({ row }) => (
      <div className="truncate max-w-60">{row.original.task}</div>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      if (row.original.assignedTo.length === 0) {
        return <Minus className="size-4 text-muted-foreground" />;
      }
      return (
        <div className="flex -space-x-2">
          {row.original.assignedTo.map((assignee) => (
            <Avatar key={assignee._id.toString()}>
              <AvatarImage src={assignee.image} />
              <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priorityInfo = formatPriority(row.original.priority);
      return (
        <Badge variant="outline" className={priorityInfo.color}>
          {priorityInfo.text}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: 'phaseTitle',
    header: 'Phase',
    cell: ({ row }) => (
      <div className="truncate max-w-60">{row.original.phaseTitle}</div>
    ),
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.createdBy.image} />
        <AvatarFallback>
          {getInitials(row.original.createdBy.name)}
        </AvatarFallback>
      </Avatar>
    ),
  },
];
