
import React from 'react';
import { CrosswordGrid as CrosswordGridType, isWordStart } from "@/utils/crosswordUtils";

interface CrosswordGridProps {
  puzzle: CrosswordGridType;
  cellSize: number;
  letterSize: number;
  previewScaleFactor: number;
  showSolution: boolean;
}

export const CrosswordGridDisplay = ({
  puzzle,
  cellSize,
  letterSize,
  previewScaleFactor,
  showSolution,
}: CrosswordGridProps) => {
  return (
    <>
      {puzzle.grid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((cell, j) => {
            const wordNumber = isWordStart(puzzle.wordPlacements, i, j);
            const isEmpty = cell === '';
            
            return (
              <div
                key={`${i}-${j}`}
                className={`flex items-center justify-center border border-gray-900 relative ${isEmpty ? 'bg-black' : 'bg-white bg-opacity-60'}`}
                style={{
                  width: `${cellSize * previewScaleFactor}px`,
                  height: `${cellSize * previewScaleFactor}px`,
                }}
              >
                {wordNumber !== null && (
                  <span 
                    className="absolute text-xs font-bold"
                    style={{
                      top: '1px',
                      left: '1px',
                      fontSize: `${8 * previewScaleFactor}px`,
                    }}
                  >
                    {wordNumber}
                  </span>
                )}
                {!isEmpty && showSolution && (
                  <span style={{ fontSize: `${letterSize * previewScaleFactor}px` }}>
                    {cell}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};
