import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Info } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  PAGE_SIZES, 
  PAGE_SIZE_OPTIONS, 
  DEFAULT_VALUES, 
  MAX_MULTIPLIERS, 
  Unit,
  MIN_PATTERN_ANGLE,
  MAX_PATTERN_ANGLE,
  MIN_IMAGE_SPACING,
  MAX_IMAGE_SPACING
} from "./constants";

interface ControlPanelProps {
  title: string;
  setTitle: (value: string) => void;
  
  subtitle: string;
  setSubtitle: (value: string) => void;
  
  instruction: string;
  setInstruction: (value: string) => void;
  
  showTitle: boolean;
  setShowTitle: (value: boolean) => void;
  
  showSubtitle: boolean;
  setShowSubtitle: (value: boolean) => void;
  
  showInstruction: boolean;
  setShowInstruction: (value: boolean) => void;
  
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
  
  showWordList: boolean;
  setShowWordList: (value: boolean) => void;
  
  selectedSize: string;
  handleSizeChange: (size: string) => void;
  
  selectedUnit: string;
  setSelectedUnit: (unit: Unit) => void;
  
  currentWidth: number;
  currentHeight: number;
  
  handleDimensionChange: (dimension: "width" | "height", value: string) => void;
  convertFromPoints: (points: number) => string;
  
  letterSizeMultiplier: number;
  setLetterSizeMultiplier: (value: number) => void;
  
  titleSizeMultiplier: number;
  setTitleSizeMultiplier: (value: number) => void;
  
  subtitleSizeMultiplier: number;
  setSubtitleSizeMultiplier: (value: number) => void;
  
  instructionSizeMultiplier: number;
  setInstructionSizeMultiplier: (value: number) => void;
  
  wordListSizeMultiplier: number;
  setWordListSizeMultiplier: (value: number) => void;
  
  cellSizeMultiplier: number;
  setCellSizeMultiplier: (value: number) => void;
  
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  
  positioningElement: string | null;
  togglePositioning: (element: string) => void;
  moveElement: (element: string, direction: 'up' | 'down') => void;
  
  formatSliderValue: (value: number) => string;
  getPositionValue: (offset: number) => string;

  uploadedImages: string[];
  onImagesChange: (images: string[]) => void;
  imageOpacity: number;
  setImageOpacity: (value: number) => void;
  imageGridSize: number;
  setImageGridSize: (value: number) => void;
  imageAngle: number;
  setImageAngle: (value: number) => void;
  imageSpacing: number;
  setImageSpacing: (value: number) => void;
}

export const ControlPanel = ({
  title,
  subtitle,
  instruction,
  selectedSize,
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  cellSizeMultiplier,
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  setTitle,
  setSubtitle,
  setInstruction,
  handleSizeChange,
  setShowTitle,
  setShowSubtitle,
  setShowInstruction,
  setShowGrid,
  setShowWordList,
  setLetterSizeMultiplier,
  setTitleSizeMultiplier,
  setSubtitleSizeMultiplier,
  setInstructionSizeMultiplier,
  setWordListSizeMultiplier,
  setCellSizeMultiplier,
  selectedUnit,
  setSelectedUnit,
  currentWidth,
  currentHeight,
  handleDimensionChange,
  convertFromPoints,
  formatSliderValue,
  getPositionValue,
  positioningElement,
  togglePositioning,
  moveElement,
  uploadedImages,
  onImagesChange,
  imageOpacity,
  setImageOpacity,
  imageGridSize,
  setImageGridSize,
  imageAngle,
  setImageAngle,
  imageSpacing,
  setImageSpacing
}: ControlPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!supportedTypes.includes(file.type)) {
        continue;
      }

      if (file.size > maxFileSize) {
        continue;
      }

      const reader = new FileReader();
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newImages.push(dataUrl);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...uploadedImages, ...newImages]);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-[60vh]">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={showTitle}
              onCheckedChange={setShowTitle}
              id="show-title"
            />
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!showTitle}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSubtitle}
              onCheckedChange={setShowSubtitle}
              id="show-subtitle"
            />
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={!showSubtitle}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="instruction">Instruction</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={showInstruction}
              onCheckedChange={setShowInstruction}
              id="show-instruction"
            />
            <Input
              id="instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={!showInstruction}
            />
          </div>
        </div>

        <Separator />
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid">Show Grid</Label>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-word-list">Show Word List</Label>
            <Switch
              id="show-word-list"
              checked={showWordList}
              onCheckedChange={setShowWordList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
