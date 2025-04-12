
import React from "react";
import { TimerDisplay } from "./TimerDisplay";
import { TimerSettings } from "./TimerSettings";
import { TaskList } from "./TaskList";
import { NotePad } from "./NotePad";
import { Stats } from "./Stats";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { NoteProvider } from "@/contexts/NoteContext";
import { cn } from "@/lib/utils";
import { usePomodoro } from "@/contexts/PomodoroContext";

const PomodoroAppContent = () => {
  const { currentMode } = usePomodoro();

  // Background color based on current mode
  const bgColor = 
    currentMode === "work" ? "bg-pomodoro-work-bg/30" :
    currentMode === "shortBreak" ? "bg-pomodoro-short-break-bg/30" :
    "bg-pomodoro-long-break-bg/30";

  return (
    <div className={cn("min-h-screen w-full transition-colors duration-500", bgColor)}>
      <div className="container mx-auto py-8 px-4 relative">
        <h1 className="text-3xl font-bold text-center mb-8">Focus Flow Scribe</h1>
        
        <TimerSettings />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TimerDisplay />
            <Stats />
          </div>
          
          <div className="space-y-6">
            <TaskList />
            <NotePad />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PomodoroApp = () => {
  return (
    <PomodoroProvider>
      <TaskProvider>
        <NoteProvider>
          <PomodoroAppContent />
        </NoteProvider>
      </TaskProvider>
    </PomodoroProvider>
  );
};
