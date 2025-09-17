"use client";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function CreateProjectPage() {
    const [step, setStep] = useState(1);
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
        if (!form.techstack.trim())
            newErrors.techstack = "*Tech Stack is required";
        if (!form.github.trim()) newErrors.github = "*GitHub Link is required";
        if (!form.mentor.trim()) newErrors.mentor = "*Mentor is required";
        if (!form.team.trim()) newErrors.team = "*Team Members is required";

        

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

       
        setStep(2);
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-3xl space-y-6 p-6">
                <h1 className="text-center text-3xl text-muted font-bold">
                    Create New Project!!!
                </h1>

                
                <div className="w-full max-w-xl mx-auto p-6">
                    {step === 1 && (
                        <div className="space-y-4 border-2 rounded-2xl p-6">
                            <div>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Title"
                                    className="w-full rounded-md border border-border bg-background p-3 focus:outline-none focus:ring-0 focus:border-[var(--borderDefault)]"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.title}
                                    </p>
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
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.techstack}
                                    </p>
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
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.github}
                                    </p>
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
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.mentor}
                                    </p>
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
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.team}
                                    </p>
                                )}
                            </div>

                            {/* Button aligned to bottom right */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="btn btn-primary"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {step === 2 && (
                    <>
                        <div className="space-y-4 border-2 rounded-2xl p-6">
                            <Accordion
                                defaultValue="phases"
                                type="single"
                                collapsible
                                className="w-full space-y-4"
                            >
                                <AccordionItem
                                    value="phases"
                                    className="card p-4"
                                >
                                    <AccordionTrigger className="text-lg font-semibold">
                                        Phase 1
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <div className="card p-4 space-y-3">
                                            <input
                                                placeholder="Phase Title"
                                                className="w-full rounded-md border border-border bg-background p-3"
                                            />
                                            <textarea
                                                placeholder="Phase Description"
                                                className="w-full rounded-md border border-border bg-background p-3"
                                                rows={3}
                                            />
                                            <input
                                                type="date"
                                                placeholder="Deadline"
                                                className="w-full rounded-md border border-border bg-background p-3"
                                            />
                                        </div>

                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="space-y-2"
                                        >
                                            <AccordionItem
                                                value="task-1"
                                                className="card p-4"
                                            >
                                                <AccordionTrigger className="text-base font-semibold">
                                                    Task 1
                                                </AccordionTrigger>
                                                <AccordionContent className="space-y-3 pt-4">
                                                    <input
                                                        placeholder="Task Title"
                                                        className="w-full rounded-md border border-border bg-background p-3"
                                                    />
                                                    <textarea
                                                        placeholder="Task Description"
                                                        className="w-full rounded-md border border-border bg-background p-3"
                                                        rows={2}
                                                    />
                                                    <input
                                                        placeholder="Assigned To"
                                                        className="w-full rounded-md border border-border bg-background p-3"
                                                    />
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        <button
                                            type="button"
                                            className="px-3 py-2 text-sm rounded-md border border-dashed border-border w-fit hover:bg-muted"
                                        >
                                            + Add Task
                                        </button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                                >
                                    + Add Phase
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
