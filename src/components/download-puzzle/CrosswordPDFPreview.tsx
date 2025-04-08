
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { PDFDocument } from "./pdf-components";

interface CrosswordPDFPreviewProps {
  puzzle: CrosswordGrid | null;
  allPuzzles?: CrosswordGrid[];
  title: string;
  subtitle: string;
  instruction: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showInstruction: boolean;
  showGrid: boolean;
  showWordList: boolean;
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  currentWidth: number;
  currentHeight: number;
  contentWidth: number;
  contentHeight: number;
  cellSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  uploadedImages?: string[];
  imageOpacity?: number;
  imageGridSize?: number;
  imageAngle?: number;
  imageSpacing?: number;
  showSolution?: boolean;
  includeSolution?: boolean;
}

export const CrosswordPDFPreview = ({ 
  puzzle,
  allPuzzles = [],
  title,
  subtitle,
  instruction,
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  currentWidth,
  currentHeight,
  contentWidth,
  contentHeight,
  cellSize,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  uploadedImages = [],
  imageOpacity = 0.3,
  imageGridSize = 100,
  imageAngle = 0,
  imageSpacing = 0,
  showSolution = false,
  includeSolution = true,
}: CrosswordPDFPreviewProps) => {
  if (!puzzle) return null;
  
  // Determine which puzzles to render
  const puzzlesToRender = allPuzzles && allPuzzles.length > 0 ? allPuzzles : [puzzle];
  
  // Calculate font sizes based on page dimensions and multipliers
  const calculateFontSizes = () => {
    // Base sizes for A4
    const a4Width = 595.28;
    const a4Height = 841.89;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = calculateFontSizes();
  
  // Function to calculate vertical position offset
  const getVerticalOffset = (offset: number) => {
    const maxAllowedOffset = Math.min(5, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };
  
  return (
    <PDFDocument 
      puzzlesToRender={puzzlesToRender}
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
      fontSizes={fontSizes}
      getVerticalOffset={getVerticalOffset}
      uploadedImages={uploadedImages}
      imageOpacity={imageOpacity}
      imageGridSize={imageGridSize}
      imageAngle={imageAngle}
      imageSpacing={imageSpacing}
      includeSolution={includeSolution}
    />
  );
};
