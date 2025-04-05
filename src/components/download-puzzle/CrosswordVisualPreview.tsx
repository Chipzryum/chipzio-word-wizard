
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { PDFViewer } from "@react-pdf/renderer";
import { CrosswordPDFPreview } from "./CrosswordPDFPreview";
import { 
  TiledBackground, 
  CrosswordGridDisplay, 
  CrosswordClueList 
} from "./crossword-components";

interface CrosswordVisualPreviewProps {
  puzzle: CrosswordGrid | null;
  showLivePreview: boolean;
  isPDFReady: boolean;
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
  letterSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  previewScaleFactor: number;
  fontSizes: {
    titleSize: number;
    subtitleSize: number;
    instructionSize: number;
    wordListSize: number;
  };
  getVerticalOffset: (offset: number) => number;
  uploadedImages?: string[];
  imageOpacity?: number;
  imageGridSize?: number;
  imageAngle?: number;
  imageSpacing?: number;
  showSolution?: boolean;
  includeSolution?: boolean;
}

export const CrosswordVisualPreview = ({
  puzzle,
  showLivePreview,
  isPDFReady,
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
  letterSize,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  previewScaleFactor,
  fontSizes,
  getVerticalOffset,
  uploadedImages = [],
  imageOpacity = 0.3,
  imageGridSize = 100,
  imageAngle = 0,
  imageSpacing = 0,
  showSolution = false,
  includeSolution = true,
}: CrosswordVisualPreviewProps) => {
  if (showLivePreview && isPDFReady) {
    return (
      <div className="w-full h-full flex-1">
        <PDFViewer width="100%" height="100%" className="border-0">
          <CrosswordPDFPreview
            puzzle={puzzle}
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
            showSolution={showSolution}
            includeSolution={includeSolution}
          />
        </PDFViewer>
      </div>
    );
  }

  return (
    <div 
      className="relative border-2 border-black bg-white p-4 overflow-hidden"
      style={{
        width: `${currentWidth * previewScaleFactor}px`,
        height: `${currentHeight * previewScaleFactor}px`,
        maxWidth: '100%',
        maxHeight: '420px', // Increased from 380px for a larger preview
      }}
    >
      {/* Apply tiled background pattern with individual rotated images */}
      {uploadedImages && uploadedImages.length > 0 && (
        <TiledBackground
          uploadedImages={uploadedImages}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
          imageGridSize={imageGridSize}
          imageSpacing={imageSpacing}
          imageOpacity={imageOpacity}
          imageAngle={imageAngle}
          previewScaleFactor={previewScaleFactor}
        />
      )}
      
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
              maxHeight: '140px', // Increased from 120px
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
    </div>
  );
};
