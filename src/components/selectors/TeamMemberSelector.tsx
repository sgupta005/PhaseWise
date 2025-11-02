'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2, X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { IUser } from '@/types/project';

interface TeamMemberSelectorProps {
  value: IUser[];
  onChange: (users: IUser[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TeamMemberSelector({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select team members...',
}: TeamMemberSelectorProps) {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ role: 'student' });
      if (search) {
        params.append('name', search);
      }

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError('Failed to fetch team members');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchStudents(searchQuery);
      } else {
        fetchStudents();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleStudent = (student: IUser) => {
    const isSelected = value.some((s) => s._id === student._id);
    if (isSelected) {
      onChange(value.filter((s) => s._id !== student._id));
    } else {
      onChange([...value, student]);
    }
  };

  const removeStudent = (studentId: string) => {
    onChange(value.filter((s) => s._id !== studentId));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value.length > 0 ? (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {value.length} member{value.length !== 1 ? 's' : ''} selected
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search team members by name..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : error ? (
                <div className="py-6 text-center text-sm text-destructive">
                  {error}
                </div>
              ) : (
                <>
                  <CommandEmpty>No students found.</CommandEmpty>
                  <CommandGroup>
                    {students.map((student) => {
                      const isSelected = value.some(
                        (s) => s._id === student._id
                      );
                      return (
                        <CommandItem
                          key={student._id}
                          value={student._id}
                          onSelect={() => toggleStudent(student)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              isSelected ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {student.email}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Members Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((member) => (
            <Badge
              key={member._id}
              variant="secondary"
              className="pl-3 pr-1 py-1.5"
            >
              <span className="text-sm">{member.name}</span>
              <button
                type="button"
                onClick={() => removeStudent(member._id)}
                disabled={disabled}
                className="ml-2 rounded-full hover:bg-muted p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

