
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { PDFTiledBackground } from "./PDFTiledBackground";
import { PDFCrosswordGrid } from "./PDFCrosswordGrid";
import { PDFCrosswordClueList } from "./PDFCrosswordClueList";
import { PDFPageNumber } from "./PDFPageNumber";

interface PDFPageProps {
  puzzle: CrosswordGrid;
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
  fontSizes: {
    titleSize: number;
    subtitleSize: number;
    instructionSize: number;
    wordListSize: number;
  };
  getVerticalOffset: (offset: number) => number;
  uploadedImages?: string[];
  imageOpacity?: number;
  imageGridSize?: number;
  imageAngle?: number;
  imageSpacing?: number;
  showSolution: boolean;
  pageNumber: number;
  totalPuzzles: number;
}

export const PDFPage = ({
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
  fontSizes,
  getVerticalOffset,
  uploadedImages = [],
  imageOpacity = 0.3,
  imageGridSize = 100,
  imageAngle = 0,
  imageSpacing = 0,
  showSolution,
  pageNumber,
  totalPuzzles,
}: PDFPageProps) => {
  // Create PDF styles
  const styles = createPDFStyles(fontSizes, cellSize, letterSizeMultiplier);
  
  // Format page numbers (Page X for puzzles, Answer X for solutions)
  const pageLabel = showSolution ? 
    `Answer ${Math.ceil(pageNumber/2)}` : 
    `Page ${Math.ceil(pageNumber/2)}`;
  
  // Determine title text with solution indicator if needed
  const titleText = showSolution 
    ? `${title.toUpperCase()} - SOLUTION` 
    : totalPuzzles > 1 
      ? `${title.toUpperCase()}` 
      : title.toUpperCase();

  return (
    <Page size={[currentWidth, currentHeight]} style={styles.page} wrap={false}>
      {/* Tiled background pattern */}
      {uploadedImages && uploadedImages.length > 0 && (
        <PDFTiledBackground
          uploadedImages={uploadedImages}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
          imageGridSize={imageGridSize}
          imageSpacing={imageSpacing}
          imageOpacity={imageOpacity}
          imageAngle={imageAngle}
        />
      )}
      
      <View style={styles.container}>
        {showTitle && (
          <View style={[styles.titleContainer, {marginTop: getVerticalOffset(titleOffset)}]}>
            <Text style={styles.title}>{titleText}</Text>
          </View>
        )}
        
        {showSubtitle && (
          <View style={[styles.subtitleContainer, {marginTop: getVerticalOffset(subtitleOffset)}]}>
            <Text style={styles.subtitle}>{subtitle.toLowerCase()}</Text>
          </View>
        )}
        
        {showInstruction && !showSolution && (
          <View style={[styles.instructionContainer, {marginTop: getVerticalOffset(instructionOffset)}]}>
            <Text style={styles.instruction}>{instruction}</Text>
          </View>
        )}
        
        {showGrid && (
          <View style={[styles.gridContainer, {marginTop: getVerticalOffset(gridOffset)}]}>
            <View style={styles.grid}>
              <PDFCrosswordGrid 
                puzzle={puzzle} 
                cellSize={cellSize} 
                letterSize={cellSize * 0.6 * Math.min(letterSizeMultiplier, 1.3)}
                showSolution={showSolution} 
              />
            </View>
          </View>
        )}
        
        {showWordList && (
          <View style={[styles.wordListContainer, {marginTop: getVerticalOffset(wordListOffset)}]}>
            <PDFCrosswordClueList 
              puzzle={puzzle} 
              styles={styles} 
            />
          </View>
        )}
      </View>
      
      {/* Page number */}
      <PDFPageNumber label={pageLabel} />
    </Page>
  );
};

// Create styles for PDF
function createPDFStyles(fontSizes: { 
  titleSize: number; 
  subtitleSize: number; 
  instructionSize: number; 
  wordListSize: number;
}, cellSize: number, letterSizeMultiplier: number) {
  // Calculate letter size based on cell size
  const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, 1.3);
  const letterSize = cellSize * 0.6 * cappedLetterSizeMultiplier;
  
  return StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Times-Roman',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#000',
      padding: 20,
      position: 'relative',
      zIndex: 1,
    },
    titleContainer: {
      zIndex: 2,
      alignSelf: 'center',
    },
    subtitleContainer: {
      zIndex: 2,
      alignSelf: 'center',
    },
    instructionContainer: {
      zIndex: 2,
      alignSelf: 'center',
    },
    gridContainer: {
      zIndex: 2,
      width: '100%',
      alignItems: 'center',
    },
    wordListContainer: {
      zIndex: 2,
      alignSelf: 'center',
      width: '100%',
    },
    title: {
      fontSize: fontSizes.titleSize,
      marginBottom: 10,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: fontSizes.subtitleSize,
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'Times-Italic',
    },
    instruction: {
      fontSize: fontSizes.instructionSize,
      marginBottom: 20,
      textAlign: 'center',
    },
    grid: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 20,
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
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderWidth: 0.5,
      borderColor: '#d1d5db',
    },
    blackCell: {
      width: cellSize,
      height: cellSize,
      backgroundColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 0.5,
      borderColor: '#d1d5db',
    },
    letter: {
      textAlign: 'center',
      alignSelf: 'center',
      fontSize: letterSize,
    },
    cellNumber: {
      position: 'absolute',
      top: 1,
      left: 1,
      fontSize: letterSize * 0.4,
    },
    wordList: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    clueList: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    acrossClues: {
      width: '50%',
      paddingRight: 10,
    },
    downClues: {
      width: '50%', 
      paddingLeft: 10,
    },
    clueHeading: {
      fontWeight: 'bold',
      marginBottom: 5,
      fontSize: fontSizes.wordListSize * 1.2,
    },
    clueItem: {
      fontSize: fontSizes.wordListSize,
      marginBottom: 3,
    },
    solutionHighlight: {
      position: 'absolute',
      backgroundColor: 'rgba(239, 68, 68, 0.3)',
      width: '100%',
      height: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  });
}
