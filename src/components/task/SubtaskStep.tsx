import { Button } from '../ui/button';
import { TaskFormStepData } from '@/schemas/task-form.schema';
import { Plus, X } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface Subtask {
  title: string;
}

export default function SubtaskStep({
  setValue,
  control,
}: {
  setValue: UseFormSetValue<TaskFormStepData>;
  control: Control<TaskFormStepData>;
}) {
  const subtasks = useWatch({
    control,
    name: 'subtasks',
    defaultValue: [],
  }) as Subtask[];

  function handleAddSubtask() {
    const currentSubtasks = subtasks || [];
    setValue('subtasks', [...currentSubtasks, { title: '' }]);
  }

  function handleRemoveSubtask(index: number) {
    const currentSubtasks = subtasks || [];
    setValue(
      'subtasks',
      currentSubtasks.filter((_, i) => i !== index)
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            Subtasks{' '}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Break down your task into smaller subtasks (optional)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddSubtask}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subtask
        </Button>
      </div>

      {!subtasks || subtasks.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
          No subtasks yet. Click &quot;Add Subtask&quot; to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {subtasks.map((subtask, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-3 bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  {/* Subtask Title */}
                  <Controller
                    name={`subtasks.${index}.title` as any}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`subtask-title-${index}`}>
                          Subtask Title{' '}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`subtask-title-${index}`}
                          placeholder="Enter subtask title"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        <FieldDescription>
                          Enter the title of the subtask
                        </FieldDescription>
                      </Field>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSubtask(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
