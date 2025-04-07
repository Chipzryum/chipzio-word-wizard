
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "../ui/button";

interface MultiPuzzleGridProps {
  puzzles: any[];
  activePuzzleIndex: number;
  onSelectPuzzle: (index: number) => void;
}

export const MultiPuzzleGrid = ({
  puzzles,
  activePuzzleIndex,
  onSelectPuzzle
}: MultiPuzzleGridProps) => {
  // A4 aspect ratio is approximately 1:1.4142 (1/√2)
  const a4AspectRatio = 1 / Math.sqrt(2); // approximately 0.7071

  if (!puzzles || puzzles.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {puzzles.map((puzzle, index) => (
        <Button
          key={index}
          variant="outline"
          className={`p-0 overflow-hidden ${
            index === activePuzzleIndex ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectPuzzle(index)}
        >
          <div className="w-full h-full">
            <AspectRatio ratio={a4AspectRatio} className="bg-white">
              <div className="p-1 w-full h-full flex flex-col">
                <div className="bg-black text-white text-xs p-1 font-medium">
                  Page {index + 1}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {puzzle.grid && (
                    <div className="grid grid-flow-row gap-0 scale-[0.5]">
                      {puzzle.grid.slice(0, 5).map((row: any[], i: number) => (
                        <div key={i} className="flex">
                          {row.slice(0, Math.min(15, row.length)).map((letter, j) => (
                            <div
                              key={`${i}-${j}`}
                              className="w-4 h-4 flex items-center justify-center border border-gray-300 text-[6px]"
                            >
                              {letter}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AspectRatio>
          </div>
        </Button>
      ))}
    </div>
  );
};
