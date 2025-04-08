
import React from "react";
import { MultiPuzzleGrid } from "@/components/download-puzzle/MultiPuzzleGrid";
import { PuzzleGrid } from "./PuzzleGrid";
import { WordList } from "./WordList";
import { PuzzleGrid as PuzzleGridType } from "@/utils/wordSearchUtils";

interface PreviewSectionProps {
  savedPuzzles: PuzzleGridType[];
  activePuzzleIndex: number;
  handleSelectPuzzle: (index: number) => void;
  puzzle: PuzzleGridType | null;
  showAnswers: boolean;
  setShowAnswers: (show: boolean) => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  savedPuzzles,
  activePuzzleIndex,
  handleSelectPuzzle,
  puzzle,
  showAnswers,
  setShowAnswers,
}) => {
  return (
    <div className="grid gap-4">
      {savedPuzzles.length > 0 && (
        <div className="bg-white/50 rounded-lg border p-4 mb-2">
          <h3 className="text-sm font-medium mb-2">Pages ({savedPuzzles.length})</h3>
          <MultiPuzzleGrid 
            puzzles={savedPuzzles}
            activePuzzleIndex={activePuzzleIndex}
            onSelectPuzzle={handleSelectPuzzle}
          />
        </div>
      )}
    
      <div className="bg-white/50 rounded-lg flex items-center justify-center border">
        {puzzle ? (
          <PuzzleGrid
            grid={puzzle.grid}
            wordPlacements={puzzle.wordPlacements}
            showAnswers={showAnswers}
          />
        ) : (
          <p className="text-muted-foreground p-8">
            Generate a puzzle to see preview
          </p>
        )}
      </div>

      {puzzle && <WordList words={puzzle.wordPlacements.map(wp => wp.word)} />}
    </div>
  );
};
