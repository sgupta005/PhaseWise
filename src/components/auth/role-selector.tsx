'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/schemas/auth.schema';

interface RoleSelectorProps {
  value?: Role;
  onChange?: (value: Role) => void;
  disabled?: boolean;
  className?: string;
}

export function RoleSelector({
  value,
  onChange,
  disabled,
  className,
}: RoleSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange?.(val as Role)}
        disabled={disabled}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="student"
            id="role-student"
            className="peer sr-only"
          />
          <Label
            htmlFor="role-student"
            className={cn(
              'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors',
              'peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <GraduationCap className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Student</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="faculty"
            id="role-faculty"
            className="peer sr-only"
          />
          <Label
            htmlFor="role-faculty"
            className={cn(
              'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors',
              'peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <Users className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Faculty</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
