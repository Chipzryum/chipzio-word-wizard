
import { Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  handleSaveLayout: () => Promise<void>;
  handleDownload: () => Promise<void>;
  isGenerating: boolean;
  isPDFReady: boolean;
  puzzle: any;
  pdfBlob: Blob | null;
}

export const ActionButtons = ({
  handleSaveLayout,
  handleDownload,
  isGenerating,
  isPDFReady,
  puzzle,
  pdfBlob,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-4 mt-4">
      <Button
        type="button"
        className="flex items-center gap-2 flex-1"
        onClick={handleSaveLayout}
        disabled={isGenerating || !puzzle}
      >
        <Save className="h-4 w-4" />
        {isGenerating ? "Generating..." : "Save Layout"}
      </Button>
      <Button
        type="button"
        variant={isPDFReady ? "default" : "outline"}
        className="flex items-center gap-2 flex-1"
        onClick={handleDownload}
        disabled={!isPDFReady || !pdfBlob}
      >
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  );
};
