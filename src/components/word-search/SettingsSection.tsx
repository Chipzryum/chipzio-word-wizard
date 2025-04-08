
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FilePlus, Download } from "lucide-react";

interface SettingsSectionProps {
  puzzle: any;
  includeAnswers: "with" | "without";
  setIncludeAnswers: (value: "with" | "without") => void;
  addToPdf: () => void;
  setShowDownloadDialog: (show: boolean) => void;
  savedPuzzles: any[];
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  puzzle,
  includeAnswers,
  setIncludeAnswers,
  addToPdf,
  setShowDownloadDialog,
  savedPuzzles,
}) => {
  if (!puzzle) return null;
  
  return (
    <div className="space-y-4">
      <div className="bg-white/50 rounded-lg border p-3">
        <div className="mb-2 text-sm font-medium">
          Add to PDF with:
        </div>
        <RadioGroup 
          value={includeAnswers} 
          onValueChange={(value: "with" | "without") => setIncludeAnswers(value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="without" id="without-answers" />
            <Label htmlFor="without-answers">Questions only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="with" id="with-answers" />
            <Label htmlFor="with-answers">Questions & answers</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={addToPdf}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:opacity-90 transition rounded-lg px-4 py-2"
        >
          <FilePlus className="h-4 w-4" />
          Add to PDF
        </button>
        <button
          onClick={() => setShowDownloadDialog(true)}
          className={`flex items-center justify-center gap-2 ${
            savedPuzzles.length > 0 ? "bg-secondary text-secondary-foreground hover:opacity-90" : "bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed"
          } transition rounded-lg px-4 py-2`}
          disabled={savedPuzzles.length === 0}
        >
          <Download className="h-4 w-4" />
          PDF
        </button>
      </div>
      
      {savedPuzzles.length > 0 && (
        <div>
          <h3 className="block text-sm font-medium mb-2">
            Pages in PDF: {savedPuzzles.length}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Click on a page to view and edit it
          </p>
        </div>
      )}
    </div>
  );
};
