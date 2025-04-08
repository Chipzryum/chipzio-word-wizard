
import React from "react";
import { WordPlacement } from "@/utils/wordSearchUtils";

interface PuzzleGridProps {
  grid: string[][];
  wordPlacements: WordPlacement[];
  showAnswers: boolean;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  grid,
  wordPlacements,
  showAnswers,
}) => {
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
    return wordPlacements.filter(placement => isPartOfWord(x, y, placement));
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
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((letter, x) => {
            const wordPlacements = getWordPlacementsForCell(x, y);
            const cellStyles = getCellStyles(x, y, wordPlacements);
            const hasHorizontalWord = wordPlacements.some(p => p.direction.x !== 0 && p.direction.y === 0);
            const hasVerticalWord = wordPlacements.some(p => p.direction.x === 0 && p.direction.y !== 0);

            return (
              <div
                key={`${x}-${y}`}
                className={`w-8 h-8 flex items-center justify-center font-medium relative ${cellStyles} ${
                  showAnswers ? "show-line" : ""
                } font-serif`}
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
  );
};
