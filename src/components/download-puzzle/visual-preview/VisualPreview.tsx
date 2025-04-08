
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
  ...props
}: VisualPreviewProps) => {
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
            title={props.title}
            subtitle={props.subtitle}
            instruction={props.instruction}
            showTitle={props.showTitle}
            showSubtitle={props.showSubtitle}
            showInstruction={props.showInstruction}
            showGrid={props.showGrid}
            showWordList={props.showWordList}
            titleOffset={props.titleOffset}
            subtitleOffset={props.subtitleOffset}
            instructionOffset={props.instructionOffset}
            gridOffset={props.gridOffset}
            wordListOffset={props.wordListOffset}
            getVerticalOffset={getVerticalOffset}
            previewScaleFactor={previewScaleFactor}
            fontSizes={fontSizes}
            titleSizeMultiplier={titleSizeMultiplier}
            subtitleSizeMultiplier={subtitleSizeMultiplier}
            instructionSizeMultiplier={instructionSizeMultiplier}
            wordListSizeMultiplier={wordListSizeMultiplier}
            cellSize={cellSize}
            showSolution={false} // Default value
          />
        </PreviewImageBackground>
      )}
    </div>
  );
};
