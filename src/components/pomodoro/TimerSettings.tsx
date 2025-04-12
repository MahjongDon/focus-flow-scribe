
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { cn } from "@/lib/utils";

export const TimerSettings = () => {
  const { timerSettings, setTimerSettings, saveSettings, currentMode } = usePomodoro();
  const [open, setOpen] = React.useState(false);
  const [localSettings, setLocalSettings] = React.useState({ ...timerSettings });

  // When dialog opens, initialize local settings from context
  React.useEffect(() => {
    if (open) {
      setLocalSettings({ ...timerSettings });
    }
  }, [open, timerSettings]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert the value to a number and ensure it's between 1 and 99
    const numValue = Math.max(1, Math.min(99, parseInt(value) || 1));
    
    setLocalSettings({
      ...localSettings,
      [name]: numValue,
    });
  };

  // Handle save button click
  const handleSave = () => {
    setTimerSettings(localSettings);
    saveSettings();
    setOpen(false);
  };

  // Button color based on current mode
  const buttonColor = 
    currentMode === "work" ? "bg-pomodoro-work hover:bg-pomodoro-work/90" :
    currentMode === "shortBreak" ? "bg-pomodoro-short-break hover:bg-pomodoro-short-break/90" :
    "bg-pomodoro-long-break hover:bg-pomodoro-long-break/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="absolute top-4 right-4 rounded-full"
        >
          <Settings size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="workMinutes">Work Minutes</Label>
            <Input
              id="workMinutes"
              name="workMinutes"
              type="number"
              min="1"
              max="99"
              value={localSettings.workMinutes}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="shortBreakMinutes">Short Break Minutes</Label>
            <Input
              id="shortBreakMinutes"
              name="shortBreakMinutes"
              type="number"
              min="1"
              max="99"
              value={localSettings.shortBreakMinutes}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="longBreakMinutes">Long Break Minutes</Label>
            <Input
              id="longBreakMinutes"
              name="longBreakMinutes"
              type="number"
              min="1"
              max="99"
              value={localSettings.longBreakMinutes}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="cycles">Cycles Before Long Break</Label>
            <Input
              id="cycles"
              name="cycles"
              type="number"
              min="1"
              max="10"
              value={localSettings.cycles}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSave}
            className={cn("transition-all", buttonColor)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
