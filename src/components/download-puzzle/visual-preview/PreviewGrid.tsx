
import { CombinedPuzzleGrid } from "../DownloadPuzzleDialog";

interface PreviewGridProps {
  puzzle: CombinedPuzzleGrid;
  cellSize: number;
  previewScaleFactor: number;
  showSolution?: boolean;
}

export const PreviewGrid = ({
  puzzle,
  cellSize,
  previewScaleFactor,
  showSolution = false
}: PreviewGridProps) => {
  // Helper function to check if a cell is part of a word in a specific direction
  const isPartOfWordInDirection = (x: number, y: number, wordPlacement: any, direction: { x: number, y: number }) => {
    if (wordPlacement.direction.x !== direction.x || wordPlacement.direction.y !== direction.y) {
      return false;
    }
    
    const { startPos, length } = wordPlacement;
    for (let i = 0; i < length; i++) {
      const checkX = startPos.x + (direction.x * i);
      const checkY = startPos.y + (direction.y * i);
      if (checkX === x && checkY === y) {
        return true;
      }
    }
    return false;
  };
  
  // Helper function to check if a cell is part of any word
  const isPartOfWord = (x: number, y: number, placement: any): boolean => {
    const { startPos, direction, length } = placement;
    for (let i = 0; i < length; i++) {
      const checkX = startPos.x + (direction.x * i);
      const checkY = startPos.y + (direction.y * i);
      if (checkX === x && checkY === y) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {puzzle.grid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((letter, j) => (
            <div
              key={`${i}-${j}`}
              className="flex items-center justify-center border border-gray-300 relative"
              style={{
                width: `${cellSize * previewScaleFactor}px`,
                height: `${cellSize * previewScaleFactor}px`,
                fontSize: `${cellSize * 0.6 * previewScaleFactor}px`,
                backgroundColor: 'rgba(255,255,255,0.6)', // Reduced opacity to show watermark through
              }}
            >
              {letter}
              {showSolution && letter && puzzle.wordPlacements && puzzle.wordPlacements.some(wp => isPartOfWord(j, i, wp)) && (
                <>
                  {/* Horizontal solution line */}
                  {puzzle.wordPlacements.some(wp => isPartOfWordInDirection(j, i, wp, { x: 1, y: 0 })) && (
                    <div className="absolute bg-red-500 opacity-30 w-full h-[2px] top-1/2 transform -translate-y-1/2" />
                  )}
                  
                  {/* Vertical solution line */}
                  {puzzle.wordPlacements.some(wp => isPartOfWordInDirection(j, i, wp, { x: 0, y: 1 })) && (
                    <div className="absolute bg-red-500 opacity-30 h-full w-[2px] left-1/2 transform -translate-x-1/2" />
                  )}
                  
                  {/* Diagonal (top-left to bottom-right) */}
                  {puzzle.wordPlacements.some(wp => isPartOfWordInDirection(j, i, wp, { x: 1, y: 1 })) && (
                    <div className="absolute bg-red-500 opacity-30 w-[140%] h-[2px] left-[-20%] top-1/2 transform -translate-y-1/2 rotate-45" />
                  )}
                  
                  {/* Diagonal (bottom-left to top-right) */}
                  {puzzle.wordPlacements.some(wp => isPartOfWordInDirection(j, i, wp, { x: 1, y: -1 })) && (
                    <div className="absolute bg-red-500 opacity-30 w-[140%] h-[2px] left-[-20%] top-1/2 transform -translate-y-1/2 -rotate-45" />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
