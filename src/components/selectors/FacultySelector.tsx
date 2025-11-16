'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2, User } from 'lucide-react';
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
import { UserDocument } from '@/models/user.model';

interface FacultySelectorProps {
  value: UserDocument | null;
  onChange: (user: UserDocument | null) => void;
  disabled?: boolean;
}

export function FacultySelector({
  value,
  onChange,
  disabled = false,
}: FacultySelectorProps) {
  const [open, setOpen] = useState(false);
  const [faculty, setFaculty] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch faculty on mount
  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async (search?: string) => {
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
  };

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{value.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select faculty...</span>
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
                  {faculty.map((facultyMember) => (
                    <CommandItem
                      key={facultyMember._id.toString()}
                      value={facultyMember._id.toString()}
                      onSelect={() => {
                        onChange(
                          value?._id?.toString() ===
                            facultyMember._id.toString()
                            ? null
                            : facultyMember
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value?._id === facultyMember._id
                            ? 'opacity-100'
                            : 'opacity-0'
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
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
