
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useNote } from "@/contexts/NoteContext";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { cn } from "@/lib/utils";

export const NotePad = () => {
  const { note, setNote, saveNote, autoSave, setAutoSave } = useNote();
  const { currentMode } = usePomodoro();
  
  // Button color based on current mode
  const buttonColor = 
    currentMode === "work" ? "bg-pomodoro-work hover:bg-pomodoro-work/90" :
    currentMode === "shortBreak" ? "bg-pomodoro-short-break hover:bg-pomodoro-short-break/90" :
    "bg-pomodoro-long-break hover:bg-pomodoro-long-break/90";

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Notes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
              <Label htmlFor="auto-save" className="text-sm">Auto Save</Label>
            </div>
            {!autoSave && (
              <Button 
                size="sm" 
                onClick={saveNote}
                className={cn("transition-all", buttonColor)}
              >
                <Save size={16} className="mr-1" /> Save
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[200px] resize-none focus:ring-1 focus:ring-gray-300"
        />
      </CardContent>
    </Card>
  );
};
