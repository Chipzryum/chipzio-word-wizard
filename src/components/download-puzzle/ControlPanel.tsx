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
        
        <Separator />
        
        <Collapsible className="w-full">
          <CollapsibleTrigger className="w-full flex items-center justify-between py-2">
            <span className="font-medium">Background Image</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-2">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Upload Image</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={triggerFileInput}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="space-y-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {uploadedImages.map((src, index) => (
                      <div key={index} className="relative group h-16 w-16 border rounded overflow-hidden">
                        <img 
                          src={src} 
                          alt={`Uploaded ${index + 1}`} 
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {uploadedImages.length > 0 && (
                    <>
                      <div className="grid gap-2 mt-4">
                        <div className="flex justify-between items-center">
                          <Label>Opacity</Label>
                          <span className="text-xs text-slate-500">
                            {Math.round(imageOpacity * 100)}%
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={1}
                          step={0.01}
                          value={[imageOpacity]}
                          onValueChange={(value) => setImageOpacity(value[0])}
                        />
                      </div>
                      
                      <div className="grid gap-2 mt-4">
                        <div className="flex justify-between items-center">
                          <Label>Pattern Size</Label>
                          <span className="text-xs text-slate-500">
                            {imageGridSize}px
                          </span>
                        </div>
                        <Slider
                          min={50}
                          max={200}
                          step={10}
                          value={[imageGridSize]}
                          onValueChange={(value) => setImageGridSize(value[0])}
                        />
                      </div>
                      
                      <div className="grid gap-2 mt-4">
                        <div className="flex justify-between items-center">
                          <Label>Pattern Angle</Label>
                          <span className="text-xs text-slate-500">
                            {imageAngle}°
                          </span>
                        </div>
                        <Slider
                          min={MIN_PATTERN_ANGLE}
                          max={MAX_PATTERN_ANGLE}
                          step={5}
                          value={[imageAngle]}
                          onValueChange={(value) => setImageAngle(value[0])}
                        />
                      </div>
                      
                      <div className="grid gap-2 mt-4">
                        <div className="flex justify-between items-center">
                          <Label>Image Spacing</Label>
                          <span className="text-xs text-slate-500">
                            {imageSpacing}px
                          </span>
                        </div>
                        <Slider
                          min={MIN_IMAGE_SPACING}
                          max={MAX_IMAGE_SPACING}
                          step={5}
                          value={[imageSpacing]}
                          onValueChange={(value) => setImageSpacing(value[0])}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
