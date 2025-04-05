
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Grid2X2,
  Download,
  RotateCw,
  Settings,
  Info,
  X,
  Sparkles,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { generateCrossword, prepareWordsForCrossword, CrosswordGrid, isWordStart } from "@/utils/crosswordUtils";
import { DEFAULT_VALUES, PAGE_SIZES, PAGE_SIZE_OPTIONS } from "@/components/download-puzzle/constants";
import { useToast } from "@/components/ui/use-toast";
import { DownloadPuzzleDialog, CrosswordVisualPreview } from "@/components/download-puzzle";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Crossword = () => {
  const { toast } = useToast();
  const [words, setWords] = useState<string[]>([]);
  const [clues, setClues] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState(15);
  const [puzzle, setPuzzle] = useState<CrosswordGrid | null>(null);
  const [bulkInput, setBulkInput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const generatePuzzle = useCallback(() => {
    if (words.length < 3) {
      toast({
        title: "Not enough words",
        description: "Please add at least 3 words to generate a crossword puzzle.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setPuzzle(null);

    setTimeout(() => {
      try {
        // Fix: Only pass words to prepareWordsForCrossword, and create a wordData array with both words and clues
        const processedWords = prepareWordsForCrossword(words);
        
        // Create a dictionary to map processed words to their clues
        const cluesMap: { [word: string]: string } = {};
        words.forEach((word, index) => {
          // Convert word to uppercase to match the processed format
          const upperWord = word.toUpperCase();
          cluesMap[upperWord] = clues[index] || '';
        });
        
        const newPuzzle = generateCrossword(processedWords, gridSize, gridSize);
        
        if (newPuzzle) {
          // Update clues in the puzzle
          newPuzzle.wordPlacements.forEach(placement => {
            placement.clue = cluesMap[placement.word] || placement.clue;
          });
          
          setPuzzle(newPuzzle);
          toast({
            title: "Crossword Generated",
            description: `Created with ${newPuzzle.wordPlacements.length} out of ${words.length} words.`,
          });
        } else {
          toast({
            title: "Failed to generate crossword",
            description: "Try adding more words or adjusting the grid size.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error generating crossword:", error);
        toast({
          title: "Error",
          description: "Failed to generate the crossword. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [words, clues, gridSize, toast]);

  const processWordAndClues = () => {
    const lines = bulkInput.split('\n').filter(line => line.trim());
    const newWords: string[] = [];
    const newClues: string[] = [];
    
    let hasErrors = false;
    
    lines.forEach((line, index) => {
      const parts = line.split(',');
      if (parts.length < 2) {
        hasErrors = true;
        return;
      }
      
      const word = parts[0].trim();
      const clue = parts.slice(1).join(',').trim();
      
      if (word.length < 3) {
        hasErrors = true;
        return;
      }
      
      if (word.includes(' ')) {
        hasErrors = true;
        return;
      }
      
      newWords.push(word);
      newClues.push(clue);
    });
    
    if (hasErrors) {
      toast({
        title: "Invalid format",
        description: "Some lines were not formatted correctly. Each line should have a word and clue separated by a comma. Words must be at least 3 characters long without spaces.",
        variant: "destructive",
      });
    }
    
    if (newWords.length > 0) {
      setWords(newWords);
      setClues(newClues);
      toast({
        title: "Words and clues added",
        description: `${newWords.length} word(s) and clues were added successfully.`,
      });
    }
  };

  const clearAll = () => {
    setWords([]);
    setClues([]);
    setBulkInput("");
    setPuzzle(null);
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const defaultPDFProps = {
    title: "CROSSWORD PUZZLE",
    subtitle: "educational crossword",
    instruction: "Solve the crossword using the clues provided",
    ...DEFAULT_VALUES,
  };
  
  // For preview scaling
  const previewScaleFactor = 0.25;
  
  // Calculate font sizes for preview
  const calculateFontSizes = () => {
    return {
      titleSize: 24,
      subtitleSize: 16,
      instructionSize: 12,
      wordListSize: 10,
    };
  };
  
  const fontSizes = calculateFontSizes();
  
  // Function to get vertical offset for positioning
  const getVerticalOffset = (offset: number) => {
    return 0; // Default for preview
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
            <Link to="/kids-tools" className="hover:text-foreground/80">
              Kids Book Tools
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Crossword Generator</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8 container">
        <section className="text-center mb-8 animate-fade-down">
          <h1 className="text-4xl font-bold mb-2">Crossword Puzzle Generator</h1>
          <p className="text-lg text-muted-foreground">
            Create custom crossword puzzles for educational activities
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-fade-right">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Word & Clue Input</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter one word and its clue per line, separated by a comma.<br />
                  Example: <code>apple, A crunchy red fruit</code>
                </p>
                
                <Textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="word, clue description"
                  className="h-[200px] font-mono"
                />
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={!bulkInput.trim() && words.length === 0}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={processWordAndClues}
                    disabled={!bulkInput.trim()}
                  >
                    Process Words & Clues
                  </Button>
                </div>
                
                {words.length > 0 && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Words added: {words.length}</p>
                    <div className="text-xs text-muted-foreground max-h-[100px] overflow-y-auto">
                      {words.map((word, index) => (
                        <div key={index} className="mb-1">
                          <strong>{word}</strong>: {clues[index]}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Settings</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Grid Size: {gridSize}×{gridSize}
                    </label>
                    <Slider
                      value={[gridSize]}
                      onValueChange={(values) => setGridSize(values[0])}
                      min={8}
                      max={20}
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Larger grids can fit more words but may be harder to solve
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="showSolution"
                      checked={showSolution}
                      onCheckedChange={() => toggleSolution()}
                    />
                    <Label
                      htmlFor="showSolution"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Show solution in preview
                    </Label>
                  </div>
                </div>
                
                <Button
                  onClick={generatePuzzle}
                  disabled={words.length < 3 || isGenerating}
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Crossword
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {words.length > 0 && !puzzle && (
              <div className="text-center p-4 border border-yellow-200 bg-yellow-50 rounded-md text-yellow-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle size={18} />
                  <span className="font-medium">Tip</span>
                </div>
                <p className="text-sm">
                  Click "Generate Crossword" to create your puzzle. The algorithm
                  works best with words that share common letters.
                </p>
              </div>
            )}
          </div>

          <div className="animate-fade-left">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Puzzle Preview</h3>
                {puzzle && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSolution}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      {showSolution ? "Hide Solution" : "Show Solution"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowDownloadDialog(true)}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center min-h-[400px] bg-secondary/30 rounded-lg overflow-hidden">
                {!puzzle ? (
                  <div className="text-center p-6">
                    <Grid2X2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No puzzle yet</h3>
                    <p className="text-muted-foreground">
                      Add words and clues, then click Generate to create a crossword
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full p-2">
                    <div className="mb-2 text-sm font-medium text-muted-foreground">
                      {puzzle.wordPlacements.length} words placed (out of {words.length})
                    </div>
                    <CrosswordVisualPreview
                      puzzle={puzzle}
                      showLivePreview={false}
                      isPDFReady={false}
                      title="CROSSWORD PUZZLE"
                      subtitle="educational crossword"
                      instruction="Solve the crossword using the clues provided"
                      showTitle={true}
                      showSubtitle={true}
                      showInstruction={true}
                      showGrid={true}
                      showWordList={true}
                      titleOffset={0}
                      subtitleOffset={0}
                      instructionOffset={0}
                      gridOffset={0}
                      wordListOffset={0}
                      currentWidth={500}
                      currentHeight={700}
                      contentWidth={400}
                      contentHeight={600}
                      cellSize={30}
                      letterSize={18}
                      letterSizeMultiplier={1}
                      titleSizeMultiplier={1}
                      subtitleSizeMultiplier={1}
                      instructionSizeMultiplier={1}
                      wordListSizeMultiplier={1}
                      previewScaleFactor={previewScaleFactor}
                      fontSizes={fontSizes}
                      getVerticalOffset={getVerticalOffset}
                      showSolution={showSolution}
                    />
                  </div>
                )}
              </div>
            </Card>

            {puzzle && (
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Across</h3>
                  <div className="max-h-[200px] overflow-y-auto text-sm">
                    {puzzle.wordPlacements
                      .filter((wp) => wp.direction === 'across')
                      .sort((a, b) => (a.number || 0) - (b.number || 0))
                      .map((wp, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="font-medium">{wp.number}.</span> {wp.clue}
                        </div>
                      ))}
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Down</h3>
                  <div className="max-h-[200px] overflow-y-auto text-sm">
                    {puzzle.wordPlacements
                      .filter((wp) => wp.direction === 'down')
                      .sort((a, b) => (a.number || 0) - (b.number || 0))
                      .map((wp, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="font-medium">{wp.number}.</span> {wp.clue}
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {showDownloadDialog && puzzle && (
        <DownloadPuzzleDialog 
          open={showDownloadDialog}
          onOpenChange={setShowDownloadDialog}
          puzzle={puzzle}
          defaultValues={defaultPDFProps}
          puzzleType="crossword"
          showSolution={showSolution}
          visualPreviewComponent="crossword"
        />
      )}
    </div>
  );
};

export default Crossword;
