
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";

interface PuzzlePDFPreviewProps {
  puzzle: PuzzleGrid | null;
  title: string;
  subtitle: string;
  instruction: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showInstruction: boolean;
  showGrid: boolean;
  showWordList: boolean;
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  currentWidth: number;
  currentHeight: number;
  contentWidth: number;
  contentHeight: number;
  cellSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
}

export const PuzzlePDFPreview = ({
  puzzle,
  title,
  subtitle,
  instruction,
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  currentWidth,
  currentHeight,
  contentWidth,
  contentHeight,
  cellSize,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
}: PuzzlePDFPreviewProps) => {
  if (!puzzle) return null;
  
  // Calculate font sizes based on page dimensions and multipliers
  // Use the same calculation method as in the DownloadPuzzleDialog component
  const calculateFontSizes = () => {
    // Base sizes for A4
    const a4Width = 595.28;
    const a4Height = 841.89;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = calculateFontSizes();
  
  // Use the exact font sizes from our calculations
  const pdfStyles = createPDFStyles(fontSizes);
  
  return (
    <Document>
      <Page size={[currentWidth, currentHeight]} style={pdfStyles.page}>
        <View style={pdfStyles.container}>
          {showTitle && <Text style={pdfStyles.title}>{title.toUpperCase()}</Text>}
          {showSubtitle && <Text style={pdfStyles.subtitle}>{subtitle.toLowerCase()}</Text>}
          {showInstruction && <Text style={pdfStyles.instruction}>{instruction}</Text>}
          {showGrid && (
            <View style={pdfStyles.grid}>
              {puzzle.grid.map((row, i) => (
                <View key={i} style={pdfStyles.row}>
                  {row.map((cell, j) => (
                    <View key={`${i}-${j}`} style={pdfStyles.cell}>
                      <Text style={pdfStyles.letter}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          {showWordList && (
            <View style={pdfStyles.wordList}>
              {puzzle.wordPlacements.map(({ word }, index) => (
                <Text key={index} style={pdfStyles.wordItem}>{word.toLowerCase()}</Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );

  // Create styles for PDF that match the preview exactly
  function createPDFStyles(fontSizes: { 
    titleSize: number; 
    subtitleSize: number; 
    instructionSize: number; 
    wordListSize: number;
  }) {
    // Apply the exact multipliers as in the preview
    // The letter size calculation remains based on cell size
    const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, 1.3);
    const letterSize = cellSize * 0.6 * cappedLetterSizeMultiplier;
    
    return StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: 'Times-Roman',
      },
      container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 20,
        position: 'relative',
      },
      title: {
        fontSize: fontSizes.titleSize,
        marginBottom: 10,
        marginTop: getVerticalOffset(titleOffset),
        textAlign: 'center',
        fontWeight: 'bold',
        display: showTitle ? 'flex' : 'none',
        position: 'relative',
      },
      subtitle: {
        fontSize: fontSizes.subtitleSize,
        marginBottom: 10,
        marginTop: getVerticalOffset(subtitleOffset),
        textAlign: 'center',
        fontFamily: 'Times-Italic',
        display: showSubtitle ? 'flex' : 'none',
        position: 'relative',
      },
      instruction: {
        fontSize: fontSizes.instructionSize,
        marginBottom: 20,
        marginTop: getVerticalOffset(instructionOffset),
        textAlign: 'center',
        display: showInstruction ? 'flex' : 'none',
        position: 'relative',
      },
      grid: {
        width: '100%',
        display: showGrid ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: getVerticalOffset(gridOffset),
        position: 'relative',
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
      },
      cell: {
        width: cellSize,
        height: cellSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      letter: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: letterSize,
      },
      wordList: {
        marginTop: getVerticalOffset(wordListOffset),
        display: showWordList ? 'flex' : 'none',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
      },
      wordItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: fontSizes.wordListSize,
      },
    });
  }

  // Calculate vertical position offset
  function getVerticalOffset(offset: number) {
    // Each unit is 10 points, limit to prevent going off page
    const maxAllowedOffset = Math.min(5, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  }
};
