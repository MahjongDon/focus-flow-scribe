
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { useTask } from "@/contexts/TaskContext";
import { 
  CheckCircle, 
  Clock,
  CircleDashed
} from "lucide-react";

export const Stats = () => {
  const { completedCycles } = usePomodoro();
  const { tasks } = useTask();
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <Clock className="text-pomodoro-work mb-1" size={24} />
            <div className="text-sm text-gray-500">Completed Cycles</div>
            <div className="font-bold text-xl">{completedCycles}</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <CheckCircle className="text-green-500 mb-1" size={24} />
            <div className="text-sm text-gray-500">Completed Tasks</div>
            <div className="font-bold text-xl">{completedTasks}</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <CircleDashed className="text-blue-500 mb-1" size={24} />
            <div className="text-sm text-gray-500">Task Completion</div>
            <div className="font-bold text-xl">{completionPercentage}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
