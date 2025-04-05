import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  validateAndProcessInput,
  generateWordSearch,
  type PuzzleGrid,
  type WordPlacement
} from "@/utils/wordSearchUtils";
import { DownloadPuzzleDialog } from "@/components/download-puzzle";

const WordSearch = () => {
  const [words, setWords] = useState<string[]>([]);
  const [gridWidth, setGridWidth] = useState(15);
  const [gridHeight, setGridHeight] = useState(15);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleGrid | null>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const { toast } = useToast();

  const generatePuzzle = () => {
    try {
      const maxDimension = Math.max(gridWidth, gridHeight);
      const processedInput = words.join('\n');
      const validationResult = validateAndProcessInput(processedInput, maxDimension);

      if (!validationResult.isValid) {
        validationResult.errors.forEach(error => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error,
          });
        });
        return;
      }

      const newPuzzle = generateWordSearch(validationResult.words, gridWidth, gridHeight);
      setPuzzle(newPuzzle);

      toast({
        title: "Success",
        description: "Puzzle generated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate puzzle",
      });
    }
  };

  const isPartOfWord = (x: number, y: number, placement: WordPlacement): boolean => {
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

  const getWordPlacementsForCell = (x: number, y: number): WordPlacement[] => {
    if (!puzzle) return [];
    return puzzle.wordPlacements.filter(placement => isPartOfWord(x, y, placement));
  };

  const getCellStyles = (x: number, y: number, placements: WordPlacement[]): string => {
    if (placements.length === 0) return "";
    if (!showAnswers) return "";

    let styles = [];
    let hasDiagonal = false;
    let diagonalDirection = '';

    placements.forEach(placement => {
      if (placement.direction.x !== 0 && placement.direction.y !== 0) {
        hasDiagonal = true;
        diagonalDirection = placement.direction.x === placement.direction.y ? 'up-to-down' : 'down-to-up';
      }
    });

    let baseStyles = "relative ";
    if (hasDiagonal) {
      baseStyles += `diagonal-word ${diagonalDirection} `;
    }

    return baseStyles;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container py-6">
          <nav className="flex items-center gap-4">
            <Link to="/" className="logo-gradient text-xl">
              <strong>Chipzio</strong>
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              to="/kids-tools"
              className="text-muted-foreground hover:text-foreground"
            >
              Kids Book Tools
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Word Search Generator</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            <section className="glass-card rounded-xl p-6 animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <Book className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Create your Word Search</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your words (one per line)
                  </label>
                  <textarea
                    className="w-full h-40 p-3 rounded-lg border bg-white/50"
                    placeholder="Example:
HELLO
WORLD
PUZZLE"
                    onChange={(e) => setWords(e.target.value.split("\n"))}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grid Width: {gridWidth}
                    </label>
                    <input
                      type="range"
                      min="7"
                      max="19"
                      value={gridWidth}
                      onChange={(e) => setGridWidth(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grid Height: {gridHeight}
                    </label>
                    <input
                      type="range"
                      min="7"
                      max="19"
                      value={gridHeight}
                      onChange={(e) => setGridHeight(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={generatePuzzle}
                    className="flex-1 bg-primary text-primary-foreground hover:opacity-90 transition rounded-lg px-4 py-2"
                  >
                    Generate Puzzle
                  </button>
                  <button
                    onClick={() => setShowDownloadDialog(true)}
                    className={`flex items-center justify-center gap-2 ${
                      puzzle ? "bg-secondary text-secondary-foreground hover:opacity-90" : "bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed"
                    } transition rounded-lg px-4 py-2`}
                    disabled={!puzzle}
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </button>
                </div>
              </div>
            </section>

            <section className="glass-card rounded-xl p-6 animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Preview</h2>
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="text-sm underline"
                  disabled={!puzzle}
                >
                  {showAnswers ? "Hide Answers" : "Show Answers"}
                </button>
              </div>

              <div className="bg-white/50 rounded-lg flex items-center justify-center border">
                {puzzle ? (
                  <div className="grid place-items-center w-full p-4">
                    <style>
                      {`
                        .diagonal-word.up-to-down::before {
                          content: '';
                          position: absolute;
                          width: 140%;
                          height: 2px;
                          background-color: rgb(239 68 68);
                          top: 50%;
                          left: -20%;
                          transform: rotate(45deg);
                          opacity: ${showAnswers ? 1 : 0};
                          transition: opacity 0.2s ease;
                        }
                        .diagonal-word.down-to-up::before {
                          content: '';
                          position: absolute;
                          width: 140%;
                          height: 2px;
                          background-color: rgb(239 68 68);
                          top: 50%;
                          left: -20%;
                          transform: rotate(-45deg);
                          opacity: ${showAnswers ? 1 : 0};
                          transition: opacity 0.2s ease;
                        }
                        .horizontal-line {
                          position: absolute;
                          height: 2px;
                          background-color: rgb(239 68 68);
                          top: 50%;
                          left: 0;
                          right: 0;
                          transform: translateY(-50%);
                          opacity: 0;
                          transition: opacity 0.2s ease;
                        }
                        .vertical-line {
                          position: absolute;
                          width: 2px;
                          background-color: rgb(239 68 68);
                          top: 0;
                          bottom: 0;
                          left: 50%;
                          transform: translateX(-50%);
                          opacity: 0;
                          transition: opacity 0.2s ease;
                        }
                        .show-line .horizontal-line,
                        .show-line .vertical-line {
                          opacity: 1;
                        }
                      `}
                    </style>
                    {puzzle.grid.map((row, y) => (
                      <div key={y} className="flex">
                        {row.map((letter, x) => {
                          const wordPlacements = getWordPlacementsForCell(x, y);
                          const cellStyles = getCellStyles(x, y, wordPlacements);
                          const hasHorizontalWord = wordPlacements.some(p => p.direction.x !== 0 && p.direction.y === 0);
                          const hasVerticalWord = wordPlacements.some(p => p.direction.x === 0 && p.direction.y !== 0);

                          return (
                            <div
                              key={`${x}-${y}`}
                              className={`w-8 h-8 flex items-center justify-center font-medium relative ${cellStyles} ${showAnswers ? 'show-line' : ''} font-serif`}
                            >
                              {hasHorizontalWord && <div className="horizontal-line" />}
                              {hasVerticalWord && <div className="vertical-line" />}
                              {letter}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground p-8">
                    Generate a puzzle to see preview
                  </p>
                )}
              </div>

              {puzzle && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Words to find:</h3>
                  <div className="flex flex-wrap gap-2">
                    {puzzle.wordPlacements.map(({ word }) => (
                      <span
                        key={word}
                        className="px-2 py-1 bg-secondary rounded-md text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <DownloadPuzzleDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        puzzle={puzzle}
        puzzleType="wordsearch"
      />
    </div>
  );
};

export default WordSearch;
