import Image from "next/image";
import React from "react";
import logo from "../../public/logo.svg";

function ProjectCard(title) {
  return (
    <div className="relative w-[20%] min-w-[250px] h-[40vh] p-[1px] rounded-2xl group hover:scale-[1.03] transition-transform duration-300 ease-out">
      {/* Outer border with blur and subtle gradient */}
      <div className="absolute inset-0 rounded-2xl border border-border bg-gradient-to-br from-card/70 to-card/50 shadow-lg backdrop-blur-md"></div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-between h-full bg-card/40 rounded-2xl p-4">
        {/* Top Section - Logo */}
        <div className="flex mb-3">
          <Image
            src={logo}
            width={80}
            height={80}
            alt="Project Logo"
            className="object-contain"
          />
        </div>

        {/* Project Info */}
        <div className="flex flex-col gap-2 ">
          <h1 className="text-lg font-semibold tracking-wide text-foreground">
            Project Title
          </h1>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat et
            cum doloremque excepturi perspiciatis aspernatur ullam ut doloribus
            voluptatibus vero.
          </p>
        </div>

        {/* Tags */}
        <ul className="flex flex-wrap gap-2 mt-3">
          {["JavaScript", "HTML", "CSS"].map((tag, i) => (
            <li
              key={i}
              className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-4 italic">
          Faculty: Ravikant
        </p>
      </div>
    </div>
  );
}

export default ProjectCard;
