
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface NoteContextType {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  saveNote: () => void;
  autoSave: boolean;
  setAutoSave: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoteContext = createContext<NoteContextType | null>(null);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [note, setNote] = useState<string>(() => {
    return localStorage.getItem("pomodoro-note") || "";
  });
  
  const [autoSave, setAutoSave] = useState<boolean>(() => {
    const saved = localStorage.getItem("pomodoro-note-autosave");
    return saved ? JSON.parse(saved) : true;
  });

  // Save auto-save preference to local storage
  useEffect(() => {
    localStorage.setItem("pomodoro-note-autosave", JSON.stringify(autoSave));
  }, [autoSave]);

  // Auto-save note if enabled
  useEffect(() => {
    if (autoSave) {
      const debounceTimeout = setTimeout(() => {
        localStorage.setItem("pomodoro-note", note);
      }, 1000);
      
      return () => clearTimeout(debounceTimeout);
    }
  }, [note, autoSave]);

  const saveNote = () => {
    localStorage.setItem("pomodoro-note", note);
    toast({
      title: "Note saved",
      description: "Your notes have been saved.",
    });
  };

  const contextValue: NoteContextType = {
    note,
    setNote,
    saveNote,
    autoSave,
    setAutoSave,
  };

  return (
    <NoteContext.Provider value={contextValue}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNote must be used within a NoteProvider");
  }
  return context;
};
