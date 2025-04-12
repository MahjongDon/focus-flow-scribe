
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

type TimerMode = "work" | "shortBreak" | "longBreak";

interface TimerSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cycles: number;
}

interface PomodoroContextType {
  timerSettings: TimerSettings;
  setTimerSettings: React.Dispatch<React.SetStateAction<TimerSettings>>;
  saveSettings: () => void;
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  timeLeft: number;
  currentMode: TimerMode;
  completedCycles: number;
  currentCycle: number;
}

const defaultSettings: TimerSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cycles: 4,
};

const PomodoroContext = createContext<PomodoroContextType | null>(null);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [timeLeft, setTimeLeft] = useState(timerSettings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<TimerMode>("work");
  const [completedCycles, setCompletedCycles] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);

  // Load notification sound
  const notificationSound = new Audio("/notification.mp3");

  // Save settings to local storage
  const saveSettings = useCallback(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(timerSettings));
    resetTimer();
    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated",
    });
  }, [timerSettings, toast]);

  // Reset timer based on current mode
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    
    switch (currentMode) {
      case "work":
        setTimeLeft(timerSettings.workMinutes * 60);
        break;
      case "shortBreak":
        setTimeLeft(timerSettings.shortBreakMinutes * 60);
        break;
      case "longBreak":
        setTimeLeft(timerSettings.longBreakMinutes * 60);
        break;
    }
  }, [currentMode, timerSettings]);

  // Switch to next mode when timer ends
  const switchMode = useCallback(() => {
    notificationSound.play().catch(err => console.error("Error playing notification:", err));
    
    if (currentMode === "work") {
      // After work session
      if (currentCycle >= timerSettings.cycles) {
        // Time for a long break after completing all cycles
        setCurrentMode("longBreak");
        setTimeLeft(timerSettings.longBreakMinutes * 60);
        setCurrentCycle(1);
        setCompletedCycles(prev => prev + 1);
        
        toast({
          title: "Time for a long break!",
          description: `You've completed ${timerSettings.cycles} work sessions. Take ${timerSettings.longBreakMinutes} minutes to recharge.`,
        });
      } else {
        // Time for a short break
        setCurrentMode("shortBreak");
        setTimeLeft(timerSettings.shortBreakMinutes * 60);
        
        toast({
          title: "Short break time!",
          description: `Great work! Take ${timerSettings.shortBreakMinutes} minutes to relax.`,
        });
      }
    } else if (currentMode === "shortBreak") {
      // After short break, back to work with incremented cycle
      setCurrentMode("work");
      setTimeLeft(timerSettings.workMinutes * 60);
      setCurrentCycle(prev => prev + 1);
      
      toast({
        title: "Back to work!",
        description: `Break's over. Focus for ${timerSettings.workMinutes} minutes.`,
      });
    } else if (currentMode === "longBreak") {
      // After long break, new set of cycles
      setCurrentMode("work");
      setTimeLeft(timerSettings.workMinutes * 60);
      
      toast({
        title: "New session begins!",
        description: `Let's start fresh with ${timerSettings.workMinutes} minutes of focused work.`,
      });
    }
  }, [currentMode, currentCycle, timerSettings, notificationSound, toast]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      switchMode();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, switchMode]);

  // Initialize timer when settings change
  useEffect(() => {
    resetTimer();
  }, [resetTimer]);

  // Toggle timer start/pause
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const contextValue: PomodoroContextType = {
    timerSettings,
    setTimerSettings,
    saveSettings,
    isRunning,
    toggleTimer,
    resetTimer,
    timeLeft,
    currentMode,
    completedCycles,
    currentCycle,
  };

  return (
    <PomodoroContext.Provider value={contextValue}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};
