
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { CrosswordGridDisplay } from "./CrosswordGrid";
import { CrosswordClueList } from "./CrosswordClueList";

interface CrosswordPreviewContentProps {
  puzzle: CrosswordGrid;
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
  letterSize: number;
  showSolution: boolean;
}

export const CrosswordPreviewContent = ({
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
  letterSize,
  showSolution,
}: CrosswordPreviewContentProps) => {
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
          className="flex flex-col items-center justify-center relative"
          style={{
            marginTop: `${getVerticalOffset(gridOffset) * previewScaleFactor}px`,
          }}
        >
          <CrosswordGridDisplay
            puzzle={puzzle}
            cellSize={cellSize}
            letterSize={letterSize}
            previewScaleFactor={previewScaleFactor}
            showSolution={showSolution}
          />
        </div>
      )}
      
      {showWordList && puzzle && (
        <div 
          className="relative"
          style={{
            marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
            fontSize: `${fontSizes.wordListSize * previewScaleFactor * wordListSizeMultiplier}px`,
            maxHeight: '140px',
          }}
        >
          <CrosswordClueList
            puzzle={puzzle}
            showSolution={showSolution}
            fontSizes={fontSizes}
            wordListSizeMultiplier={wordListSizeMultiplier}
            previewScaleFactor={previewScaleFactor}
          />
        </div>
      )}
    </div>
  );
};
