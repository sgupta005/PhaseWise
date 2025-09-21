"use client";
import { useState } from "react";
import Phase from "@/components/Phase";
import { TrainFront } from "lucide-react";

export default function CreateProjectPage() {
  const [step, setStep] = useState(2);
  const [form, setForm] = useState({
    title: "",
    description: "",
    techstack: "",
    url: "",
    github: "",
    mentor: "",
    team: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phases, setPhases] = useState<number[]>([1]); // track phases

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "*Title is required";
    if (!form.description.trim())
      newErrors.description = "*Description is required";
    if (!form.techstack.trim()) newErrors.techstack = "*Tech Stack is required";
    if (!form.github.trim()) newErrors.github = "*GitHub Link is required";
    if (!form.mentor.trim()) newErrors.mentor = "*Mentor is required";
    if (!form.team.trim()) newErrors.team = "*Team Members is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep(2);
  };

  const handleAddPhase = () => {
    setPhases([...phases, phases.length + 1]); // add next phase
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-3xl space-y-6 p-6">
        <h1 className="text-center text-3xl text-foreground font-bold">
          Create New Project!!!
        </h1>

        {/* Step 1 - Form */}
        {step === 1 && (
          <div className="w-full mx-auto p-6 space-y-4 border-2 rounded-2xl shadow-xl">
            <div>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <textarea 
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <input
                name="techstack"
                value={form.techstack}
                onChange={handleChange}
                placeholder="Tech Stack"
                className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
              />
              {errors.techstack && (
                <p className="text-red-500 text-sm mt-1">{errors.techstack}</p>
              )}
            </div>

            <div>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="Project URL (Optional)"
                className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
              />
            </div>

            <div>
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="GitHub Link (https://github.com)"
                className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
              />
              {errors.github && (
                <p className="text-red-500 text-sm mt-1">{errors.github}</p>
              )}
            </div>

            <div>
              <input
                name="mentor"
                value={form.mentor}
                onChange={handleChange}
                placeholder="Mentor"
                className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
              />
              {errors.mentor && (
                <p className="text-red-500 text-sm mt-1">{errors.mentor}</p>
              )}
            </div>

            <div>
              <input
                name="team"
                value={form.team}
                onChange={handleChange}
                placeholder="Team Members"
                className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
              />
              {errors.team && (
                <p className="text-red-500 text-sm mt-1">{errors.team}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 - Phases */}
        {step === 2 && (
          <div className="space-y-4 border-2 shadow-xl rounded-2xl p-6">
            {phases.map((num) => (
              <Phase key={num} number={num} />
            ))}

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleAddPhase}
                className="btn btn-secondary cursor-pointer"
              >
                + Add Phase
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="btn btn-primary cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button className="btn bg-destructive text-popover cursor-pointer hover:bg-green-900 duration-300">
            <TrainFront />
            Ask to Ai
          </button>
        </div>
      </div>
    </div>
  );
}
