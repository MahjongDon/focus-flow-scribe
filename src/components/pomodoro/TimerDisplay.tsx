
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { cn } from "@/lib/utils";
import { useTask } from "@/contexts/TaskContext";

export const TimerDisplay = () => {
  const { 
    timeLeft, 
    isRunning, 
    toggleTimer, 
    resetTimer, 
    currentMode,
    currentCycle,
    timerSettings
  } = usePomodoro();
  
  const { tasks, currentTaskId } = useTask();
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  
  // Get current task if one is selected
  const currentTask = tasks.find(task => task.id === currentTaskId);
  
  // Set timer background and text colors based on current mode
  const modeClasses = {
    work: {
      bg: "bg-pomodoro-work-bg",
      text: "text-pomodoro-work",
      animation: isRunning ? "animate-pulse-scale" : ""
    },
    shortBreak: {
      bg: "bg-pomodoro-short-break-bg",
      text: "text-pomodoro-short-break",
      animation: isRunning ? "animate-pulse-scale" : ""
    },
    longBreak: {
      bg: "bg-pomodoro-long-break-bg",
      text: "text-pomodoro-long-break",
      animation: isRunning ? "animate-pulse-scale" : ""
    }
  };
  
  const modeLabels = {
    work: "Focus Time",
    shortBreak: "Short Break",
    longBreak: "Long Break"
  };

  return (
    <Card className={cn("w-full shadow-md transition-all duration-300", modeClasses[currentMode].bg)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          {/* Mode label */}
          <div className={cn("text-lg font-medium mb-2", modeClasses[currentMode].text)}>
            {modeLabels[currentMode]}
            {currentMode === "work" && ` (${currentCycle}/${timerSettings.cycles})`}
          </div>
          
          {/* Timer display */}
          <div 
            className={cn(
              "text-6xl font-bold mb-4 transition-all", 
              modeClasses[currentMode].text,
              modeClasses[currentMode].animation
            )}
          >
            {formattedTime}
          </div>
          
          {/* Current task display */}
          {currentTask && (
            <div className="mb-4 text-lg font-medium">
              Working on: <span className={cn("font-semibold", modeClasses[currentMode].text)}>
                {currentTask.text}
              </span>
            </div>
          )}
          
          {/* Control buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={toggleTimer}
              size="lg"
              className={cn(
                "transition-all hover:scale-105",
                currentMode === "work" ? "bg-pomodoro-work hover:bg-pomodoro-work/90" :
                currentMode === "shortBreak" ? "bg-pomodoro-short-break hover:bg-pomodoro-short-break/90" :
                "bg-pomodoro-long-break hover:bg-pomodoro-long-break/90"
              )}
            >
              {isRunning ? <Pause className="mr-2" size={20} /> : <Play className="mr-2" size={20} />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            
            <Button 
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="transition-all hover:scale-105"
            >
              <RotateCcw className="mr-2" size={20} />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
