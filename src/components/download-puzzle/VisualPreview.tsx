
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { PDFViewer } from "@react-pdf/renderer";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";
import { CombinedPuzzleGrid } from "./DownloadPuzzleDialog";

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

  // Create a tiled background similar to the PDF version
  const createTiledBackground = () => {
    if (!uploadedImages || uploadedImages.length === 0) return null;
    
    const imageElements = [];
    
    // Calculate number of images needed to cover the preview completely with spacing
    const adjustedImageSize = imageGridSize * previewScaleFactor;
    const adjustedSpacing = imageSpacing * previewScaleFactor;
    const totalImageSize = adjustedImageSize + adjustedSpacing;
    
    // Add extra rows/columns to ensure rotation covers the entire page
    const extraCoverForRotation = imageAngle > 0 ? 2 : 0;
    const horizontalCount = Math.ceil(currentWidth * previewScaleFactor / totalImageSize) + extraCoverForRotation;
    const verticalCount = Math.ceil(currentHeight * previewScaleFactor / totalImageSize) + extraCoverForRotation;
    
    // Starting position offset for rotation coverage
    const offsetX = imageAngle > 0 ? -adjustedImageSize : 0;
    const offsetY = imageAngle > 0 ? -adjustedImageSize : 0;
    
    for (let y = 0; y < verticalCount; y++) {
      for (let x = 0; x < horizontalCount; x++) {
        const posX = offsetX + x * (adjustedImageSize + adjustedSpacing);
        const posY = offsetY + y * (adjustedImageSize + adjustedSpacing);
        
        imageElements.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: `${posX}px`,
              top: `${posY}px`,
              width: `${adjustedImageSize}px`,
              height: `${adjustedImageSize}px`,
              backgroundImage: `url(${uploadedImages[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: imageOpacity,
              transform: `rotate(${imageAngle}deg)`,
              transformOrigin: 'center',
            }}
          />
        );
      }
    }
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {imageElements}
      </div>
    );
  };

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
      {/* Apply tiled background pattern with individual rotated images */}
      {uploadedImages && uploadedImages.length > 0 && createTiledBackground()}
      
      <div className="flex flex-col h-full relative" style={{ zIndex: 2 }}>
        {showTitle && (
          <div 
            className="text-center font-bold font-serif relative"
            style={{
              fontSize: `${fontSizes.titleSize * previewScaleFactor * titleSizeMultiplier}px`,
              marginTop: `${getVerticalOffset(titleOffset) * previewScaleFactor}px`,
            }}
          >
            {title.toUpperCase()}
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
        {showInstruction && (
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
            {puzzle.grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((letter, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="flex items-center justify-center border border-gray-300"
                    style={{
                      width: `${cellSize * previewScaleFactor}px`,
                      height: `${cellSize * previewScaleFactor}px`,
                      fontSize: `${letterSize * previewScaleFactor}px`,
                      backgroundColor: 'rgba(255,255,255,0.6)', // Reduced opacity to show watermark through
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {showWordList && puzzle && puzzle.wordPlacements && puzzle.wordPlacements.length > 0 && (
          <div 
            className="flex flex-wrap justify-center mt-4 px-2 relative"
            style={{
              marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
              fontSize: `${fontSizes.wordListSize * previewScaleFactor * wordListSizeMultiplier}px`,
              maxHeight: '140px', // Increased from unspecified
              overflowY: 'auto'
            }}
          >
            {puzzle.wordPlacements.map(({ word }, index) => (
              <span key={index} className="mx-2 px-1 py-0.5 bg-gray-100 rounded-md mb-1">
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
