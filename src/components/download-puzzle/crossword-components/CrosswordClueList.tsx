
import React from 'react';
import { CrosswordGrid } from "@/utils/crosswordUtils";

interface CrosswordClueListProps {
  puzzle: CrosswordGrid;
  showSolution: boolean;
  fontSizes: {
    wordListSize: number;
  };
  wordListSizeMultiplier: number;
  previewScaleFactor: number;
}

export const CrosswordClueList = ({
  puzzle,
  showSolution,
  fontSizes,
  wordListSizeMultiplier,
  previewScaleFactor,
}: CrosswordClueListProps) => {
  // Categorize word placements by direction for clues
  const acrossClues = puzzle.wordPlacements
    .filter(placement => placement.direction === 'across')
    .sort((a, b) => (a.number || 0) - (b.number || 0));
    
  const downClues = puzzle.wordPlacements
    .filter(placement => placement.direction === 'down')
    .sort((a, b) => (a.number || 0) - (b.number || 0));

  return (
    <div className="grid grid-cols-2 gap-2 mt-4 px-2 relative overflow-auto">
      <div>
        <div className="font-bold mb-1">ACROSS</div>
        {acrossClues.map((placement) => (
          <div key={`across-${placement.number}`} className="text-xs mb-1">
            {placement.number}. {placement.clue}
            {showSolution ? ` (${placement.word})` : ''}
          </div>
        ))}
      </div>
      <div>
        <div className="font-bold mb-1">DOWN</div>
        {downClues.map((placement) => (
          <div key={`down-${placement.number}`} className="text-xs mb-1">
            {placement.number}. {placement.clue}
            {showSolution ? ` (${placement.word})` : ''}
          </div>
        ))}
      </div>
    </div>
  );
};
