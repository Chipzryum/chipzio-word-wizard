
import React from "react";

interface WordListProps {
  words: string[];
}

export const WordList: React.FC<WordListProps> = ({ words }) => {
  if (!words || words.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Words to find:</h3>
      <div className="flex flex-wrap gap-2">
        {words.map((word) => (
          <span
            key={word}
            className="px-2 py-1 bg-secondary rounded-md text-sm"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};
