
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  currentTaskId: string | null;
  setCurrentTaskId: (id: string | null) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("pomodoro-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(() => {
    return localStorage.getItem("pomodoro-current-task");
  });

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save current task to local storage
  useEffect(() => {
    if (currentTaskId) {
      localStorage.setItem("pomodoro-current-task", currentTaskId);
    } else {
      localStorage.removeItem("pomodoro-current-task");
    }
  }, [currentTaskId]);

  const addTask = (text: string) => {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task added",
      description: "Your new task has been added to the list.",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    
    // If we're marking the current task as complete, show a toast
    const targetTask = tasks.find(task => task.id === id);
    if (targetTask && id === currentTaskId && !targetTask.completed) {
      toast({
        title: "Task completed",
        description: "Great job! You've completed this task.",
      });
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    
    // If we're deleting the current task, clear the current task
    if (id === currentTaskId) {
      setCurrentTaskId(null);
    }
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const contextValue: TaskContextType = {
    tasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    currentTaskId,
    setCurrentTaskId,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
