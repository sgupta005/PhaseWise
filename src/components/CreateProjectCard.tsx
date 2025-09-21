import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function CreateProjectCard() {
  return (
    <div className="w-[20%] min-w-[200px] h-[40vh] relative rounded-xl p-1 group hover:scale-[1.02] transition-transform duration-300">
      {/* Elegant border effect */}
      <div className="absolute inset-0 rounded-xl border border-border bg-card/80 shadow-lg backdrop-blur-sm"></div>

      {/* Card content */}
      <Link href='/create-project' className="relative h-full w-full rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300">
        <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors duration-300">
          <Plus
            className="text-primary group-hover:scale-110 transition-transform duration-300"
            size={40}
          />
        </div>
        <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
          Create Project
        </p>
      </Link>
    </div>
  );
}

export default CreateProjectCard;
