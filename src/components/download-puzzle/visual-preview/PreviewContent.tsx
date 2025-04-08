
import { CombinedPuzzleGrid } from "../DownloadPuzzleDialog";
import { PreviewGrid } from "./PreviewGrid";
import { PreviewWordList } from "./PreviewWordList";

interface PreviewContentProps {
  puzzle: CombinedPuzzleGrid;
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
  getVerticalOffset: (offset: number) => number;
  previewScaleFactor: number;
  fontSizes: {
    titleSize: number;
    subtitleSize: number;
    instructionSize: number;
    wordListSize: number;
  };
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  cellSize: number;
  showSolution?: boolean; // Add this property
}

export const PreviewContent = ({
  puzzle,
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
  getVerticalOffset,
  previewScaleFactor,
  fontSizes,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  cellSize,
  showSolution = false, // Provide a default value
}: PreviewContentProps) => {
  return (
    <div className="flex flex-col h-full relative" style={{ zIndex: 2 }}>
      {showTitle && (
        <div 
          className="text-center font-bold font-serif relative"
          style={{
            fontSize: `${fontSizes.titleSize * previewScaleFactor * titleSizeMultiplier}px`,
            marginTop: `${getVerticalOffset(titleOffset) * previewScaleFactor}px`,
          }}
        >
          {showSolution ? `${title.toUpperCase()} - SOLUTION` : title.toUpperCase()}
        </div>
      )}
      
      {showSubtitle && (
        <div 
          className="text-center italic font-serif relative"
          style={{
            fontSize: `${fontSizes.subtitleSize * previewScaleFactor * subtitleSizeMultiplier}px`,
            marginTop: `${getVerticalOffset(subtitleOffset) * previewScaleFactor}px`,
          }}
        >
          {subtitle.toLowerCase()}
        </div>
      )}
      
      {showInstruction && !showSolution && (
        <div 
          className="text-center mb-4 relative"
          style={{
            fontSize: `${fontSizes.instructionSize * previewScaleFactor * instructionSizeMultiplier}px`,
            marginTop: `${getVerticalOffset(instructionOffset) * previewScaleFactor}px`,
          }}
        >
          {instruction}
        </div>
      )}
      
      {showGrid && puzzle && (
        <div 
          style={{
            marginTop: `${getVerticalOffset(gridOffset) * previewScaleFactor}px`,
          }}
        >
          <PreviewGrid 
            puzzle={puzzle}
            cellSize={cellSize}
            previewScaleFactor={previewScaleFactor}
            showSolution={showSolution}
          />
        </div>
      )}
      
      {showWordList && puzzle && (
        <div 
          style={{
            marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
          }}
        >
          <PreviewWordList
            puzzle={puzzle}
            fontSizes={fontSizes}
            previewScaleFactor={previewScaleFactor}
            wordListSizeMultiplier={wordListSizeMultiplier}
            showSolution={showSolution}
          />
        </div>
      )}
    </div>
  );
};
