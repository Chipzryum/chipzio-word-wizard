import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { pdf } from "@react-pdf/renderer";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { VisualPreview } from "./VisualPreview";
import { CrosswordVisualPreview } from "./CrosswordVisualPreview";
import { ControlPanel } from "./ControlPanel";
import { ActionButtons } from "./ActionButtons";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";
import { CrosswordPDFPreview } from "./CrosswordPDFPreview";
import { 
  PAGE_SIZES, 
  UNITS, 
  PDF_MARGIN, 
  BORDER_WIDTH, 
  BASE_PADDING, 
  MAX_OFFSET,
  DEFAULT_TITLE_MULTIPLIER,
  DEFAULT_SUBTITLE_MULTIPLIER,
  DEFAULT_INSTRUCTION_MULTIPLIER,
  DEFAULT_CELL_MULTIPLIER,
  DEFAULT_LETTER_SIZE_MULTIPLIER,
  DEFAULT_WORDLIST_MULTIPLIER,
  MAX_LETTER_SIZE,
  DEFAULT_IMAGE_OPACITY,
  DEFAULT_IMAGE_GRID_SIZE,
  MIN_IMAGE_GRID_SIZE,
  MAX_IMAGE_GRID_SIZE,
  PageSize,
  Unit
} from "./constants";
import { Slider } from "../ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type CombinedPuzzleGrid = PuzzleGrid | CrosswordGrid;

interface DownloadPuzzleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puzzle: CombinedPuzzleGrid;
  defaultValues?: {
    title: string;
    subtitle: string;
    instruction: string;
  };
  puzzleType?: "wordsearch" | "crossword";
  showSolution?: boolean;
  visualPreviewComponent?: "wordsearch" | "crossword";
}

const MIN_IMAGE_SPACING = 0;

export function DownloadPuzzleDialog({
  open,
  onOpenChange,
  puzzle,
  defaultValues = {
    title: "Puzzle",
    subtitle: "educational puzzle",
    instruction: "Can you solve the puzzle?"
  },
  puzzleType = "wordsearch",
  showSolution = false,
  visualPreviewComponent = "wordsearch"
}: DownloadPuzzleDialogProps) {
  
  const [title, setTitle] = useState(defaultValues.title);
  const [subtitle, setSubtitle] = useState(defaultValues.subtitle);
  const [instruction, setInstruction] = useState(defaultValues.instruction);
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);
  
  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(DEFAULT_TITLE_MULTIPLIER);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(DEFAULT_SUBTITLE_MULTIPLIER);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(DEFAULT_INSTRUCTION_MULTIPLIER);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(DEFAULT_CELL_MULTIPLIER);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(DEFAULT_LETTER_SIZE_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);

  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showWordList, setShowWordList] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  const [positioningElement, setPositioningElement] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  
  const [showLivePreview, setShowLivePreview] = useState(false);

  const [uploadedImages, setUploadedImages] = useLocalStorage<string[]>("puzzle-images", []);
  const [imageOpacity, setImageOpacity] = useState(DEFAULT_IMAGE_OPACITY);
  const [imageGridSize, setImageGridSize] = useState(DEFAULT_IMAGE_GRID_SIZE);
  
  const [imageAngle, setImageAngle] = useState(0);
  const [imageSpacing, setImageSpacing] = useState(MIN_IMAGE_SPACING);
  
  const { toast } = useToast();
  
  const previewScaleFactor = 0.3;

  const handleUnitChange = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const togglePositioning = (element: string | null) => {
    setPositioningElement(element);
  };

  const moveElement = (element: string, direction: 'up' | 'down') => {
    const amount = 1;
    const change = direction === 'up' ? -amount : amount;
    
    switch (element) {
      case 'title':
        setTitleOffset(prev => prev + change);
        break;
      case 'subtitle':
        setSubtitleOffset(prev => prev + change);
        break;
      case 'instruction':
        setInstructionOffset(prev => prev + change);
        break;
      case 'grid':
        setGridOffset(prev => prev + change);
        break;
      case 'wordList':
        setWordListOffset(prev => prev + change);
        break;
      default:
        break;
    }
  };

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  const contentWidth = currentWidth - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);
  const contentHeight = currentHeight - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);

  const calculateFontSizes = () => {
    const a4Width = PAGE_SIZES.A4.width;
    const a4Height = PAGE_SIZES.A4.height;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = calculateFontSizes();
  
  const calculateSpaceNeeded = () => {
    let space = 0;
    if (showTitle) space += fontSizes.titleSize * titleSizeMultiplier + 10;
    if (showSubtitle) space += fontSizes.subtitleSize * subtitleSizeMultiplier + 10;
    if (showInstruction) space += fontSizes.instructionSize * instructionSizeMultiplier + 20;
    if (showWordList) space += fontSizes.wordListSize * wordListSizeMultiplier * 3;
    return space;
  };

  const calculateGridCellSize = () => {
    if (!puzzle) return 20;
    
    const gridWidth = puzzle.grid[0].length;
    const gridHeight = puzzle.grid.length;
    
    const reservedSpace = calculateSpaceNeeded() + 40;
    
    const availableHeight = contentHeight - reservedSpace;
    const availableWidth = contentWidth;
    
    const cellSizeByWidth = availableWidth / gridWidth;
    const cellSizeByHeight = availableHeight / gridHeight;
    
    const baseSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    return baseSize * cellSizeMultiplier;
  };

  const cellSize = calculateGridCellSize();
  
  const calculateLetterSize = () => {
    const baseLetterSize = cellSize * 0.6;
    
    const cappedMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
    
    return baseLetterSize * cappedMultiplier;
  };
  
  const letterSize = calculateLetterSize();

  const getVerticalOffset = (offset: number) => {
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };

  const handleSizeChange = (size: PageSize) => {
    setSelectedSize(size);
    if (size !== "Custom") {
      setCustomWidth(PAGE_SIZES[size].width);
      setCustomHeight(PAGE_SIZES[size].height);
    }
    setIsPDFReady(false);
  };

  const handleDimensionChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const pointValue = numValue * UNITS[selectedUnit];
    if (dimension === "width") {
      setCustomWidth(pointValue);
    } else {
      setCustomHeight(pointValue);
    }
    setSelectedSize("Custom");
    setIsPDFReady(false);
  };

  const convertFromPoints = (points: number) => {
    return (points / UNITS[selectedUnit]).toFixed(2);
  };

  const handleSaveLayout = async () => {
    if (!puzzle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzle to save. Please generate a puzzle first.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      console.log("Creating PDF with letterSizeMultiplier:", letterSizeMultiplier);
      console.log("Creating PDF with cellSize:", cellSize);
      console.log("Word list visibility:", showWordList);
      
      const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
      console.log("Creating PDF with cappedLetterSizeMultiplier:", cappedLetterSizeMultiplier);
      
      let pdfDocument;
      
      if (puzzleType === "crossword") {
        pdfDocument = (
          <CrosswordPDFPreview
            puzzle={puzzle as CrosswordGrid}
            title={title}
            subtitle={subtitle}
            instruction={instruction}
            showTitle={showTitle}
            showSubtitle={showSubtitle}
            showInstruction={showInstruction}
            showGrid={showGrid}
            showWordList={showWordList}
            titleOffset={titleOffset}
            subtitleOffset={subtitleOffset}
            instructionOffset={instructionOffset}
            gridOffset={gridOffset}
            wordListOffset={wordListOffset}
            currentWidth={currentWidth}
            currentHeight={currentHeight}
            contentWidth={contentWidth}
            contentHeight={contentHeight}
            cellSize={cellSize}
            letterSizeMultiplier={letterSizeMultiplier}
            titleSizeMultiplier={titleSizeMultiplier}
            subtitleSizeMultiplier={subtitleSizeMultiplier}
            instructionSizeMultiplier={instructionSizeMultiplier}
            wordListSizeMultiplier={wordListSizeMultiplier}
            uploadedImages={uploadedImages}
            imageOpacity={imageOpacity}
            imageGridSize={imageGridSize}
            imageAngle={imageAngle}
            imageSpacing={imageSpacing}
            showSolution={false}
            includeSolution={true}
          />
        );
      } else {
        pdfDocument = (
          <PuzzlePDFPreview
            puzzle={puzzle as PuzzleGrid}
            title={title}
            subtitle={subtitle}
            instruction={instruction}
            showTitle={showTitle}
            showSubtitle={showSubtitle}
            showInstruction={showInstruction}
            showGrid={showGrid}
            showWordList={showWordList}
            titleOffset={titleOffset}
            subtitleOffset={subtitleOffset}
            instructionOffset={instructionOffset}
            gridOffset={gridOffset}
            wordListOffset={wordListOffset}
            currentWidth={currentWidth}
            currentHeight={currentHeight}
            contentWidth={contentWidth}
            contentHeight={contentHeight}
            cellSize={cellSize}
            letterSizeMultiplier={letterSizeMultiplier}
            titleSizeMultiplier={titleSizeMultiplier}
            subtitleSizeMultiplier={subtitleSizeMultiplier}
            instructionSizeMultiplier={instructionSizeMultiplier}
            wordListSizeMultiplier={wordListSizeMultiplier}
            uploadedImages={uploadedImages}
            imageOpacity={imageOpacity}
            imageGridSize={imageGridSize}
            imageAngle={imageAngle}
            imageSpacing={imageSpacing}
            includeSolution={true}
          />
        );
      }
      
      const blob = await pdf(pdfDocument).toBlob();
      
      console.log("PDF blob generated successfully:", blob);
      setPdfBlob(blob);
      setIsPDFReady(true);
      setShowLivePreview(true);
      
      toast({
        title: "PDF Ready",
        description: "Your layout has been saved. Click 'Download PDF' to download.",
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!puzzle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzle to download. Please generate a puzzle first.",
      });
      return;
    }
    
    if (!isPDFReady || !pdfBlob) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please save the layout first by clicking 'Save Layout'.",
      });
      return;
    }
    
    try {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  const formatSliderValue = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const getPositionValue = (offset: number) => {
    if (offset === 0) return '0';
    return offset > 0 ? `+${offset}` : `${offset}`;
  };

  const renderPreview = () => {
    if (visualPreviewComponent === "crossword") {
      return (
        <CrosswordVisualPreview 
          puzzle={puzzle as CrosswordGrid}
          showLivePreview={showLivePreview}
          isPDFReady={isPDFReady}
          title={title}
          subtitle={subtitle}
          instruction={instruction}
          showTitle={showTitle}
          showSubtitle={showSubtitle}
          showInstruction={showInstruction}
          showGrid={showGrid}
          showWordList={showWordList}
          titleOffset={titleOffset}
          subtitleOffset={subtitleOffset}
          instructionOffset={instructionOffset}
          gridOffset={gridOffset}
          wordListOffset={wordListOffset}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
          contentWidth={contentWidth}
          contentHeight={contentHeight}
          cellSize={cellSize}
          letterSize={letterSize}
          letterSizeMultiplier={letterSizeMultiplier}
          titleSizeMultiplier={titleSizeMultiplier}
          subtitleSizeMultiplier={subtitleSizeMultiplier}
          instructionSizeMultiplier={instructionSizeMultiplier}
          wordListSizeMultiplier={wordListSizeMultiplier}
          previewScaleFactor={previewScaleFactor}
          fontSizes={fontSizes}
          getVerticalOffset={getVerticalOffset}
          uploadedImages={uploadedImages}
          imageOpacity={imageOpacity}
          imageGridSize={imageGridSize}
          imageAngle={imageAngle}
          imageSpacing={imageSpacing}
          showSolution={showSolution}
          includeSolution={true}
        />
      );
    } else {
      return (
        <VisualPreview 
          puzzle={puzzle as PuzzleGrid}
          showLivePreview={showLivePreview}
          isPDFReady={isPDFReady}
          title={title}
          subtitle={subtitle}
          instruction={instruction}
          showTitle={showTitle}
          showSubtitle={showSubtitle}
          showInstruction={showInstruction}
          showGrid={showGrid}
          showWordList={showWordList}
          titleOffset={titleOffset}
          subtitleOffset={subtitleOffset}
          instructionOffset={instructionOffset}
          gridOffset={gridOffset}
          wordListOffset={wordListOffset}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
          contentWidth={contentWidth}
          contentHeight={contentHeight}
          cellSize={cellSize}
          letterSize={letterSize}
          letterSizeMultiplier={letterSizeMultiplier}
          titleSizeMultiplier={titleSizeMultiplier}
          subtitleSizeMultiplier={subtitleSizeMultiplier}
          instructionSizeMultiplier={instructionSizeMultiplier}
          wordListSizeMultiplier={wordListSizeMultiplier}
          previewScaleFactor={previewScaleFactor}
          fontSizes={fontSizes}
          getVerticalOffset={getVerticalOffset}
          uploadedImages={uploadedImages}
          imageOpacity={imageOpacity}
          imageGridSize={imageGridSize}
          imageAngle={imageAngle}
          imageSpacing={imageSpacing}
          includeSolution={true}
        />
      );
    }
  };

  useEffect(() => {
    setIsPDFReady(false);
    setShowLivePreview(false);
  }, [
    titleSizeMultiplier, subtitleSizeMultiplier, instructionSizeMultiplier,
    cellSizeMultiplier, letterSizeMultiplier, wordListSizeMultiplier,
    showTitle, showSubtitle, showInstruction, showWordList, showGrid,
    titleOffset, subtitleOffset, instructionOffset, gridOffset, wordListOffset,
    title, subtitle, instruction, selectedSize, customWidth, customHeight,
    uploadedImages, imageOpacity, imageGridSize, imageAngle, imageSpacing
  ]);

  console.log("Word list toggle status:", showWordList);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Puzzle</DialogTitle>
          <DialogDescription>
            Customize your puzzle before downloading
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content">
          <TabsList className="grid grid-cols-4 mb-4 w-full">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="aesthetics">Aesthetics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ControlPanel 
                showTitle={showTitle}
                setShowTitle={setShowTitle}
                title={title}
                setTitle={setTitle}
                titleSizeMultiplier={titleSizeMultiplier}
                setTitleSizeMultiplier={setTitleSizeMultiplier}
                titleOffset={titleOffset}
                positioningElement={positioningElement}
                togglePositioning={togglePositioning}
                moveElement={moveElement}
                
                showSubtitle={showSubtitle}
                setShowSubtitle={setShowSubtitle}
                subtitle={subtitle}
                setSubtitle={setSubtitle}
                subtitleSizeMultiplier={subtitleSizeMultiplier}
                setSubtitleSizeMultiplier={setSubtitleSizeMultiplier}
                subtitleOffset={subtitleOffset}
                
                showInstruction={showInstruction}
                setShowInstruction={setShowInstruction}
                instruction={instruction}
                setInstruction={setInstruction}
                instructionSizeMultiplier={instructionSizeMultiplier}
                setInstructionSizeMultiplier={setInstructionSizeMultiplier}
                instructionOffset={instructionOffset}
                
                selectedSize={selectedSize}
                handleSizeChange={handleSizeChange}
                
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                cellSizeMultiplier={cellSizeMultiplier}
                setCellSizeMultiplier={setCellSizeMultiplier}
                letterSizeMultiplier={letterSizeMultiplier}
                setLetterSizeMultiplier={setLetterSizeMultiplier}
                gridOffset={gridOffset}
                
                showWordList={showWordList}
                setShowWordList={setShowWordList}
                wordListSizeMultiplier={wordListSizeMultiplier}
                setWordListSizeMultiplier={setWordListSizeMultiplier}
                wordListOffset={wordListOffset}
                
                selectedUnit={selectedUnit}
                setSelectedUnit={handleUnitChange}
                currentWidth={currentWidth}
                currentHeight={currentHeight}
                handleDimensionChange={handleDimensionChange}
                convertFromPoints={convertFromPoints}
                formatSliderValue={formatSliderValue}
                getPositionValue={getPositionValue}
                
                uploadedImages={uploadedImages}
                onImagesChange={setUploadedImages}
                imageOpacity={imageOpacity}
                setImageOpacity={setImageOpacity}
                imageGridSize={imageGridSize}
                setImageGridSize={setImageGridSize}
                imageAngle={imageAngle}
                setImageAngle={setImageAngle}
                imageSpacing={imageSpacing}
                setImageSpacing={setImageSpacing}
              />
            </div>

            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {renderPreview()}
              </div>
              
              <ActionButtons 
                handleSaveLayout={handleSaveLayout}
                handleDownload={handleDownload}
                isGenerating={isGenerating}
                isPDFReady={isPDFReady}
                puzzle={puzzle}
                pdfBlob={pdfBlob}
              />
              
              {!isPDFReady && (
                <p className="text-xs text-muted-foreground">
                  Click "Save Layout" after making changes to update the PDF preview.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                <h3 className="font-medium mb-3">Page Size</h3>
                <Select value={selectedSize} onValueChange={(value) => handleSizeChange(value as PageSize)}>
                  <SelectTrigger className="w-full mb-3">
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PAGE_SIZES).map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedSize === "Custom" && (
                <>
                  <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                    <h3 className="font-medium mb-3">Custom Dimensions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Width ({selectedUnit})</Label>
                        <input
                          type="number"
                          value={convertFromPoints(customWidth)}
                          onChange={(e) => handleDimensionChange("width", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height ({selectedUnit})</Label>
                        <input
                          type="number"
                          value={convertFromPoints(customHeight)}
                          onChange={(e) => handleDimensionChange("height", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                    <h3 className="font-medium mb-3">Units</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(UNITS).map((unit) => (
                        <button
                          key={unit}
                          onClick={() => handleUnitChange(unit as Unit)}
                          className={`py-2 px-4 rounded-md transition-colors ${
                            selectedUnit === unit
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                <h3 className="font-medium mb-3">Element Position</h3>
                <div className="space-y-4">
                  {showTitle && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Title Position</Label>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">
                          {getPositionValue(titleOffset)}
                        </span>
                      </div>
                      <Slider
                        value={[titleOffset]}
                        min={-20}
                        max={20}
                        step={1}
                        onValueChange={(values) => setTitleOffset(values[0])}
                      />
                    </div>
                  )}
                  
                  {showSubtitle && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Subtitle Position</Label>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">
                          {getPositionValue(subtitleOffset)}
                        </span>
                      </div>
                      <Slider
                        value={[subtitleOffset]}
                        min={-20}
                        max={20}
                        step={1}
                        onValueChange={(values) => setSubtitleOffset(values[0])}
                      />
                    </div>
                  )}
                  
                  {showInstruction && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Instruction Position</Label>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">
                          {getPositionValue(instructionOffset)}
                        </span>
                      </div>
                      <Slider
                        value={[instructionOffset]}
                        min={-20}
                        max={20}
                        step={1}
                        onValueChange={(values) => setInstructionOffset(values[0])}
                      />
                    </div>
                  )}
                  
                  {showGrid && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Grid Position</Label>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">
                          {getPositionValue(gridOffset)}
                        </span>
                      </div>
                      <Slider
                        value={[gridOffset]}
                        min={-20}
                        max={20}
                        step={1}
                        onValueChange={(values) => setGridOffset(values[0])}
                      />
                    </div>
                  )}
                  
                  {showWordList && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Word List Position</Label>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">
                          {getPositionValue(wordListOffset)}
                        </span>
                      </div>
                      <Slider
                        value={[wordListOffset]}
                        min={-20}
                        max={20}
                        step={1}
                        onValueChange={(values) => setWordListOffset(values[0])}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {renderPreview()}
              </div>
              
              <ActionButtons 
                handleSaveLayout={handleSaveLayout}
                handleDownload={handleDownload}
                isGenerating={isGenerating}
                isPDFReady={isPDFReady}
                puzzle={puzzle}
                pdfBlob={pdfBlob}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sizes" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                <div className="grid gap-2">
                  <Label className="font-medium">Letters Size</Label>
                  <Slider
                    value={[letterSizeMultiplier * 100]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(value) => setLetterSizeMultiplier(value[0] / 100)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50%</span>
                    <span>{(letterSizeMultiplier * 100).toFixed(0)}%</span>
                    <span>150%</span>
                  </div>
                </div>
              </div>

              {showTitle && (
                <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                  <div className="grid gap-2">
                    <Label className="font-medium">Title Size</Label>
                    <Slider
                      value={[titleSizeMultiplier * 100]}
                      min={50}
                      max={150}
                      step={1}
                      onValueChange={(value) => setTitleSizeMultiplier(value[0] / 100)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>{(titleSizeMultiplier * 100).toFixed(0)}%</span>
                      <span>150%</span>
                    </div>
                  </div>
                </div>
              )}

              {showSubtitle && (
                <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                  <div className="grid gap-2">
                    <Label className="font-medium">Subtitle Size</Label>
                    <Slider
                      value={[subtitleSizeMultiplier * 100]}
                      min={50}
                      max={150}
                      step={1}
                      onValueChange={(value) => setSubtitleSizeMultiplier(value[0] / 100)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>{(subtitleSizeMultiplier * 100).toFixed(0)}%</span>
                      <span>150%</span>
                    </div>
                  </div>
                </div>
              )}

              {showInstruction && (
                <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                  <div className="grid gap-2">
                    <Label className="font-medium">Instruction Size</Label>
                    <Slider
                      value={[instructionSizeMultiplier * 100]}
                      min={50}
                      max={150}
                      step={1}
                      onValueChange={(value) =>
                        setInstructionSizeMultiplier(value[0] / 100)
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>{(instructionSizeMultiplier * 100).toFixed(0)}%</span>
                      <span>150%</span>
                    </div>
                  </div>
                </div>
              )}

              {showWordList && (
                <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                  <div className="grid gap-2">
                    <Label className="font-medium">Word List Size</Label>
                    <Slider
                      value={[wordListSizeMultiplier * 100]}
                      min={50}
                      max={150}
                      step={1}
                      onValueChange={(value) =>
                        setWordListSizeMultiplier(value[0] / 100)
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>{(wordListSizeMultiplier * 100).toFixed(0)}%</span>
                      <span>150%</span>
                    </div>
                  </div>
                </div>
              )}
              
              {showGrid && (
                <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                  <div className="grid gap-2">
                    <Label className="font-medium">Grid Cell Size</Label>
                    <Slider
                      value={[cellSizeMultiplier * 100]}
                      min={50}
                      max={150}
                      step={1}
                      onValueChange={(value) => setCellSizeMultiplier(value[0] / 100)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>{(cellSizeMultiplier * 100).toFixed(0)}%</span>
                      <span>150%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {renderPreview()}
              </div>
              
              <ActionButtons 
                handleSaveLayout={handleSaveLayout}
                handleDownload={handleDownload}
                isGenerating={isGenerating}
                isPDFReady={isPDFReady}
                puzzle={puzzle}
                pdfBlob={pdfBlob}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="aesthetics" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                <h3 className="font-medium mb-3">Background Images</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative w-12 h-12 rounded overflow-hidden border">
                      <img 
                        src={image} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => {
                          const newImages = [...uploadedImages];
                          newImages.splice(index, 1);
                          setUploadedImages(newImages);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setUploadedImages([...uploadedImages, event.target.result as string]);
                        }
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="w-full mb-4"
                />
              </div>
              
              {uploadedImages.length > 0 && (
                <>
                  <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                    <div className="grid gap-2">
                      <Label className="font-medium">Image Opacity</Label>
                      <Slider
                        value={[imageOpacity * 100]}
                        min={5}
                        max={100}
                        step={1}
                        onValueChange={(value) => setImageOpacity(value[0] / 100)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5%</span>
                        <span>{Math.round(imageOpacity * 100)}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                    <div className="grid gap-2">
                      <Label className="font-medium">Image Size</Label>
                      <Slider
                        value={[imageGridSize]}
                        min={MIN_IMAGE_GRID_SIZE}
                        max={MAX_IMAGE_GRID_SIZE}
                        step={1}
                        onValueChange={(value) => setImageGridSize(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Small</span>
                        <span>{imageGridSize}</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                    <div className="grid gap-2">
                      <Label className="font-medium">Image Angle</Label>
                      <Slider
                        value={[imageAngle]}
                        min={0}
                        max={90}
                        step={5}
                        onValueChange={(value) => setImageAngle(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0°</span>
                        <span>{imageAngle}°</span>
                        <span>90°</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
                    <div className="grid gap-2">
                      <Label className="font-medium">Image Spacing</Label>
                      <Slider
                        value={[imageSpacing]}
                        min={0}
                        max={50}
                        step={2}
                        onValueChange={(value) => setImageSpacing(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>None</span>
                        <span>{imageSpacing}px</span>
                        <span>Max</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {renderPreview()}
              </div>
              
              <ActionButtons 
                handleSaveLayout={handleSaveLayout}
                handleDownload={handleDownload}
                isGenerating={isGenerating}
                isPDFReady={isPDFReady}
                puzzle={puzzle}
                pdfBlob={pdfBlob}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
