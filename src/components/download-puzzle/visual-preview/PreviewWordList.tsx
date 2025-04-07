
import { CombinedPuzzleGrid } from "../DownloadPuzzleDialog";

interface PreviewWordListProps {
  puzzle: CombinedPuzzleGrid;
  fontSizes: {
    wordListSize: number;
  };
  previewScaleFactor: number;
  wordListSizeMultiplier: number;
}

export const PreviewWordList = ({
  puzzle,
  fontSizes,
  previewScaleFactor,
  wordListSizeMultiplier
}: PreviewWordListProps) => {
  if (!puzzle?.wordPlacements || puzzle.wordPlacements.length === 0) return null;
  
  return (
    <div 
      className="flex flex-wrap justify-center mt-4 px-2 relative"
      style={{
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
  );
};
