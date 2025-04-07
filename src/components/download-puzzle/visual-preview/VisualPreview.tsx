
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { PDFViewer } from "@react-pdf/renderer";
import { PuzzlePDFPreview } from "../PuzzlePDFPreview";
import { CombinedPuzzleGrid } from "../DownloadPuzzleDialog";
import { PreviewImageBackground } from "./PreviewImageBackground";
import { PreviewContent } from "./PreviewContent";

interface VisualPreviewProps {
  puzzle: CombinedPuzzleGrid | null;
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
  includeSolution?: boolean;
}

export const VisualPreview = ({
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
  includeSolution = true,
}: VisualPreviewProps) => {
  if (showLivePreview && isPDFReady) {
    return (
      <div className="w-full h-full flex-1">
        <PDFViewer width="100%" height="100%" className="border-0">
          <PuzzlePDFPreview
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
            includeSolution={includeSolution}
          />
        </PDFViewer>
      </div>
    );
  }

  console.log("Rendering VisualPreview with showWordList:", showWordList);
  console.log("Puzzle words:", puzzle?.wordPlacements.map(wp => wp.word));

  // Set dimensions to maintain A4 aspect ratio
  const a4AspectRatio = 1 / Math.sqrt(2); // Approximately 0.7071 (standard ISO 216)
  const scaledWidth = currentWidth * previewScaleFactor;
  const scaledHeight = scaledWidth / a4AspectRatio;

  return (
    <div 
      className="relative border-2 border-black bg-white p-4 overflow-hidden"
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        maxWidth: '100%',
        maxHeight: '420px',
      }}
    >
      {puzzle && (
        <PreviewImageBackground
          uploadedImages={uploadedImages}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
          imageGridSize={imageGridSize}
          imageSpacing={imageSpacing}
          imageOpacity={imageOpacity}
          imageAngle={imageAngle}
          previewScaleFactor={previewScaleFactor}
        >
          <PreviewContent
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
            getVerticalOffset={getVerticalOffset}
            previewScaleFactor={previewScaleFactor}
            fontSizes={fontSizes}
            titleSizeMultiplier={titleSizeMultiplier}
            subtitleSizeMultiplier={subtitleSizeMultiplier}
            instructionSizeMultiplier={instructionSizeMultiplier}
            wordListSizeMultiplier={wordListSizeMultiplier}
            cellSize={cellSize}
          />
        </PreviewImageBackground>
      )}
    </div>
  );
};
