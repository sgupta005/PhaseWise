import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function CreateProjectCard() {
  return (
    <div className="w-[20%] min-w-[200px] h-[40vh] relative rounded-xl p-1">
      {/* Elegant border effect */}
      <div className="absolute inset-0 rounded-xl border border-[var(--border-default)] bg-[var(--bg-muted)]/30 backdrop-blur-md shadow-md"></div>

      {/* Card content */}
      <Link href='/create-project' className="relative h-full w-full rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ">
        <Plus
          className="border border-[var(--border-default)] rounded-full p-6 text-[var(--accent)] hover:scale-105 transition-transform duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          size={80}
        />
        <p className="text-lg font-medium text-[var(--text-default)]">
          Create Project
        </p>
      </Link>
    </div>
  );
}

export default CreateProjectCard;
