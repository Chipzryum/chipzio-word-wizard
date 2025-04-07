
import { CombinedPuzzleGrid } from "../DownloadPuzzleDialog";

interface PreviewGridProps {
  puzzle: CombinedPuzzleGrid;
  cellSize: number;
  previewScaleFactor: number;
}

export const PreviewGrid = ({
  puzzle,
  cellSize,
  previewScaleFactor
}: PreviewGridProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {puzzle.grid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((letter, j) => (
            <div
              key={`${i}-${j}`}
              className="flex items-center justify-center border border-gray-300"
              style={{
                width: `${cellSize * previewScaleFactor}px`,
                height: `${cellSize * previewScaleFactor}px`,
                fontSize: `${cellSize * 0.6 * previewScaleFactor}px`,
                backgroundColor: 'rgba(255,255,255,0.6)', // Reduced opacity to show watermark through
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
