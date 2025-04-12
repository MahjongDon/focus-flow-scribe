
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTask } from "@/contexts/TaskContext";
import { Badge } from "@/components/ui/badge";
import { Check, PlayCircle, Plus, Trash } from "lucide-react";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { cn } from "@/lib/utils";

export const TaskList = () => {
  const { tasks, addTask, toggleTaskCompletion, deleteTask, currentTaskId, setCurrentTaskId } = useTask();
  const { currentMode } = usePomodoro();
  const [newTaskText, setNewTaskText] = useState("");
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText("");
    }
  };

  const handleFocusTask = (taskId: string) => {
    setCurrentTaskId(taskId === currentTaskId ? null : taskId);
  };
  
  // Button color based on current mode
  const buttonColor = 
    currentMode === "work" ? "bg-pomodoro-work hover:bg-pomodoro-work/90" :
    currentMode === "shortBreak" ? "bg-pomodoro-short-break hover:bg-pomodoro-short-break/90" :
    "bg-pomodoro-long-break hover:bg-pomodoro-long-break/90";

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          Tasks
          <Badge className="ml-2 bg-gray-200 text-gray-700">
            {tasks.filter(t => !t.completed).length} remaining
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add task form */}
        <form onSubmit={handleAddTask} className="flex space-x-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="icon"
            className={cn("transition-all", buttonColor)}
          >
            <Plus size={20} />
          </Button>
        </form>

        {/* Task list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No tasks yet. Add one to get started!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-all",
                  task.completed ? "bg-gray-100" : "bg-white",
                  currentTaskId === task.id && "border-2 border-pomodoro-work"
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="data-[state=checked]:bg-green-500"
                />
                <span
                  className={cn(
                    "flex-grow",
                    task.completed && "line-through text-gray-500"
                  )}
                >
                  {task.text}
                </span>
                <div className="flex space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleFocusTask(task.id)}
                    className="h-8 w-8"
                    title={currentTaskId === task.id ? "Unselect task" : "Focus on this task"}
                  >
                    {currentTaskId === task.id ? (
                      <Check size={16} className="text-pomodoro-work" />
                    ) : (
                      <PlayCircle size={16} />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
