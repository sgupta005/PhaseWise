import { UserDocument } from '@/models/user.model';
import {
  UseFormSetValue,
  Control,
  useWatch,
  Controller,
  FieldPath,
  PathValue,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PRIORITIES } from '@/constants';
import { CreatePhaseTask } from '@/schemas/phase-form.schema';

interface PhaseTaskFormProps<
  TFormData extends Record<string, any>,
  TField extends FieldPath<TFormData>,
> {
  control: Control<TFormData>;
  setValue: UseFormSetValue<TFormData>;
  teamMembers: UserDocument[];
  tasksFieldPath: TField;
}

export default function PhaseTaskForm<
  TFormData extends Record<string, any>,
  TField extends FieldPath<TFormData>,
>({
  control,
  setValue,
  teamMembers,
  tasksFieldPath,
}: PhaseTaskFormProps<TFormData, TField>) {
  const watched = useWatch<TFormData, TField>({
    control,
    name: tasksFieldPath,
    defaultValue: [] as PathValue<TFormData, TField>,
  });

  const tasks = (watched || []) as CreatePhaseTask[];

  function handleAddTask() {
    const currentTasks = tasks || [];
    const newTasks = [
      ...currentTasks,
      { task: '', assignedTo: [], priority: 'Medium Priority' as const },
    ];
    setValue(tasksFieldPath, newTasks as PathValue<TFormData, TField>);
  }

  function handleRemoveTask(taskIndex: number) {
    const currentTasks = tasks || [];
    const filteredTasks = currentTasks.filter((_, i) => i !== taskIndex);
    setValue(tasksFieldPath, filteredTasks as PathValue<TFormData, TField>);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold">
            Tasks{' '}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Break down your Phase into Tasks
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {!tasks || tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded">
          No tasks added yet.
        </p>
      ) : (
        tasks.map((task, taskIndex) => (
          <div className="p-4 border rounded-lg space-y-4" key={taskIndex}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground truncate">
                Task {taskIndex + 1}
                {task.task ? ':' : ''} {task.task}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveTask(taskIndex)}
                className="h-6 w-6 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Task Description */}
            <Controller
              name={
                `${tasksFieldPath}.${taskIndex}.task` as FieldPath<TFormData>
              }
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Task <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter task description"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Provide a concise description for your task.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Priority */}
            <Controller
              name={
                `${tasksFieldPath}.${taskIndex}.priority` as FieldPath<TFormData>
              }
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={`${tasksFieldPath}.${taskIndex}.priority`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {/* Assigned To */}
            <Controller
              name={
                `${tasksFieldPath}.${taskIndex}.assignedTo` as FieldPath<TFormData>
              }
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Assigned To</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map((member) => (
                      <Badge
                        key={member._id.toString()}
                        className="cursor-pointer"
                        onClick={() =>
                          field.onChange([
                            ...(field.value || []),
                            member._id.toString(),
                          ])
                        }
                        variant={
                          (field.value?.includes(member._id.toString()) ??
                          false)
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {member.name}
                      </Badge>
                    ))}
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            {/* Due Date */}
            <Controller
              name={
                `${tasksFieldPath}.${taskIndex}.dueDate` as FieldPath<TFormData>
              }
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Due Date</FieldLabel>
                  <Input
                    type="date"
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        ))
      )}
    </div>
  );
}
