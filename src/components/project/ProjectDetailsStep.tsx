import { ProjectFormStepData } from '@/schemas/project-form.schema';
import { Control, Controller } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MultiFacultySelector } from '../selectors/MultiFacultySelector';
import { TeamMemberSelector } from '../selectors/TeamMemberSelector';
import { Textarea } from '../ui/textarea';

export default function ProjectDetailsStep({
  control,
}: {
  control: Control<ProjectFormStepData>;
}) {
  return (
    <form>
      <FieldGroup>
        {/* Project Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Project Title <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your project's title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                Provide a concise title for your project.
              </FieldDescription>
            </Field>
          )}
        />
        {/* Project Description */}
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Project Description
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your project's description"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                Provide a detailed description for your project.
              </FieldDescription>
            </Field>
          )}
        />
        {/* Tech Stack */}
        <Controller
          name="techStack"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Tech Stack
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your project's comma separated tech stack (e.g. React, Node.js, MongoDB, TypeScript)"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                Provide a comma separated list of technologies used in your
                project.
              </FieldDescription>
            </Field>
          )}
        />
        {/* GitHub Link */}
        <Controller
          name="githubLink"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>GitHub Link</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your project's GitHub link"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                Provide your project&apos;s GitHub link.
              </FieldDescription>
            </Field>
          )}
        />
        {/* Project URL */}
        <Controller
          name="projectUrl"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Live URL</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your project's live URL"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                Provide your project&apos;s live URL.
              </FieldDescription>
            </Field>
          )}
        />
        {/* Faculty Selector */}
        <Controller
          name="facultyIds"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Faculty Mentors
              </FieldLabel>
              <MultiFacultySelector value={field.value || []} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                Optionally select faculty mentors to oversee the project.
              </FieldDescription>
            </Field>
          )}
        />
        {/* Team Members Selector */}
        <Controller
          name="teamMemberIds"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Team Members
                <span className="text-destructive">*</span>
              </FieldLabel>
              <TeamMemberSelector
                value={field.value}
                onChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                Select all students who will work on this project.
              </FieldDescription>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
