
import React from "react";

interface WordInputSectionProps {
  setWords: (words: string[]) => void;
  gridWidth: number;
  setGridWidth: (width: number) => void;
  gridHeight: number;
  setGridHeight: (height: number) => void;
  generatePuzzle: () => void;
}

export const WordInputSection: React.FC<WordInputSectionProps> = ({
  setWords,
  gridWidth,
  setGridWidth,
  gridHeight,
  setGridHeight,
  generatePuzzle,
}) => {
  return (
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
      </div>
    </div>
  );
};
