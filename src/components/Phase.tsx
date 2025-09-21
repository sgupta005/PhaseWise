"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Task = {
  id: number;
  task: string;
  assignedTo: string[];
  priority: "Low Priority" | "Medium Priority" | "High Priority" | "Urgent";
};

type PhaseProps = {
  number: number;
};

function Phase({ number }: PhaseProps) {
  const [phaseTitle, setPhaseTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ Validate phase inputs
  const validatePhase = () => {
    let newErrors: { [key: string]: string } = {};
    if (!phaseTitle.trim()) newErrors.phaseTitle = "Phase title is required.";
    if (!deadline) newErrors.deadline = "Set deadline for phase.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Validate individual task
  const validateTask = (task: Task) => {
    let newErrors: { [key: string]: string } = {};
    if (!task.task.trim()) newErrors.taskDescription = "Task description is required.";
    if (task.assignedTo.length === 0) newErrors.assignedTo = "Please assign to at least one student.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Add new task
  const addTask = () => {
    if (!validatePhase()) return; // ensure phase is filled before adding task
    const newTask: Task = {
      id: Date.now(),
      task: "",
      assignedTo: [],
      priority: "Low Priority",
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // ✅ Update task fields dynamically
  const updateTask = (id: number, field: keyof Task, value: string | string[]) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  // ✅ Handle assigned to field (convert comma-separated to array)
  const handleAssignedToChange = (taskId: number, value: string) => {
    const assignedArray = value.split(',').map(item => item.trim()).filter(item => item);
    updateTask(taskId, 'assignedTo', assignedArray);
  };

  return (
    <Accordion
      defaultValue="phase"
      type="single"
      collapsible
      className="w-full border rounded-xl "
    >
      <AccordionItem value="phase" className="p-4">
        <AccordionTrigger className="text-lg font-semibold">
          Phase {number}
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {/* Phase Details */}
          <div className="space-y-3">
            <div>
              <input
                placeholder="Phase Title"
                value={phaseTitle}
                onChange={(e) => setPhaseTitle(e.target.value)}
                className="w-full rounded-md border border-border bg-transparent p-3 focus:outline-none"
              />
              {errors.phaseTitle && (
                <p className="text-red-500 text-sm">{errors.phaseTitle}</p>
              )}
            </div>


            <div>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-md border border-border bg-transparent p-3 focus:outline-none"
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm">{errors.deadline}</p>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <Accordion type="single" collapsible className="space-y-3">
            {tasks.map((task, idx) => (
              <AccordionItem
                key={task.id}
                value={`task-${task.id}`}
                className="p-4 border rounded-md last:border-b"
              >
                <AccordionTrigger className="text-base font-medium">
                  Task {idx + 1}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  <div>
                    <textarea
                      placeholder="Task Description"
                      value={task.task}
                      onChange={(e) => updateTask(task.id, "task", e.target.value)}
                      className="w-full rounded-md border border-border bg-transparent p-3 focus:outline-none"
                      rows={2}
                    />
                    {errors.taskDescription && !task.task && (
                      <p className="text-red-500 text-sm">{errors.taskDescription}</p>
                    )}
                  </div>

                  <div>
                    <input
                      placeholder="Assigned To (comma-separated student IDs/emails)"
                      value={task.assignedTo.join(', ')}
                      onChange={(e) => handleAssignedToChange(task.id, e.target.value)}
                      className="w-full rounded-md border border-border bg-transparent p-3 focus:outline-none"
                    />
                    {errors.assignedTo && task.assignedTo.length === 0 && (
                      <p className="text-red-500 text-sm">{errors.assignedTo}</p>
                    )}
                  </div>

                  <div>
                    <select
                      value={task.priority}
                      onChange={(e) => updateTask(task.id, "priority", e.target.value as Task["priority"])}
                      className="w-full rounded-md border border-border bg-transparent p-3 focus:outline-none"
                    >
                      <option value="Low Priority">Low Priority</option>
                      <option value="Medium Priority">Medium Priority</option>
                      <option value="High Priority">High Priority</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={addTask}
            className="btn btn-secondary"
          >
            + Add Task
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default Phase;