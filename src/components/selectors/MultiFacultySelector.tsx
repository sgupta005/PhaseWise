'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2, X, GraduationCap } from 'lucide-react';
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
import { UserDocument } from '@/models/user.model';

interface MultiFacultySelectorProps {
  value: string[];
  onChange: (userIds: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MultiFacultySelector({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select faculty mentors...',
}: MultiFacultySelectorProps) {
  const [open, setOpen] = useState(false);
  const [faculty, setFaculty] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  async function fetchFaculty(search?: string) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ role: 'faculty' });
      if (search) {
        params.append('name', search);
      }

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setFaculty(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch faculty');
      }
    } catch (err) {
      setError('Failed to fetch faculty members');
      console.error('Error fetching faculty:', err);
    } finally {
      setLoading(false);
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchFaculty(searchQuery);
      } else {
        fetchFaculty();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  function toggleFaculty(facultyMember: UserDocument) {
    const isSelected = value.some((id) => id === facultyMember._id.toString());
    if (isSelected) {
      onChange(value.filter((id) => id !== facultyMember._id.toString()));
    } else {
      onChange([...value, facultyMember._id.toString()]);
    }
  }

  const removeFaculty = (facultyId: string) => {
    onChange(value.filter((id) => id !== facultyId));
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
            {value?.length > 0 ? (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {value.length} mentor{value.length !== 1 ? 's' : ''} selected
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
              placeholder="Search faculty by name..."
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
                  <CommandEmpty>No faculty found.</CommandEmpty>
                  <CommandGroup>
                    {faculty.map((facultyMember) => {
                      const isSelected = value?.some(
                        (id) => id === facultyMember._id.toString()
                      );
                      return (
                        <CommandItem
                          key={facultyMember._id.toString()}
                          value={facultyMember._id.toString()}
                          onSelect={() => toggleFaculty(facultyMember)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              isSelected ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {facultyMember.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {facultyMember.email}
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

      {/* Selected Faculty Display */}
      {value?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((facultyId) => (
            <Badge
              key={facultyId}
              variant="secondary"
              className="pl-3 pr-1 py-1.5"
            >
              <span className="text-sm">
                {faculty.find((f) => f._id.toString() === facultyId)?.name ||
                  'Loading...'}
              </span>
              <button
                type="button"
                onClick={() => removeFaculty(facultyId)}
                disabled={disabled}
                className="ml-2 rounded-full hover:bg-purple-200 p-0.5 transition-colors"
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
