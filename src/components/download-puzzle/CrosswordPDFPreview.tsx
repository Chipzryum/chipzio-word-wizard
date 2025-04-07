
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CrosswordGrid } from "@/utils/crosswordUtils";

interface CrosswordPDFPreviewProps {
  puzzle: CrosswordGrid | null;
  allPuzzles?: CrosswordGrid[];
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
  uploadedImages?: string[];
  imageOpacity?: number;
  imageGridSize?: number;
  imageAngle?: number;
  imageSpacing?: number;
  showSolution?: boolean;
  includeSolution?: boolean;
}

export const CrosswordPDFPreview = ({ 
  puzzle,
  allPuzzles = [],
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
  uploadedImages = [],
  imageOpacity = 0.3,
  imageGridSize = 100,
  imageAngle = 0,
  imageSpacing = 0,
  showSolution = false,
  includeSolution = true,
}: CrosswordPDFPreviewProps) => {
  if (!puzzle) return null;
  
  // Determine which puzzles to render
  const puzzlesToRender = allPuzzles && allPuzzles.length > 0 ? allPuzzles : [puzzle];
  
  // Calculate font sizes based on page dimensions and multipliers
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
  
  // Create a tiled background pattern that's confined to a single page
  const createTiledBackground = () => {
    if (!uploadedImages || uploadedImages.length === 0) return null;
    
    const imageElements = [];
    
    // Calculate number of images needed to cover the page completely
    // Make sure not to exceed the page boundaries
    const horizontalCount = Math.ceil(currentWidth / (imageGridSize + imageSpacing)) + 1;
    const verticalCount = Math.ceil(currentHeight / (imageGridSize + imageSpacing)) + 1;
    
    // Create a grid of images that stays within page boundaries
    for (let y = 0; y < verticalCount; y++) {
      for (let x = 0; x < horizontalCount; x++) {
        // Calculate the actual width and height to avoid overflow
        const imgWidth = x === horizontalCount - 1 && x * (imageGridSize + imageSpacing) + imageGridSize > currentWidth
          ? currentWidth - (x * (imageGridSize + imageSpacing))
          : imageGridSize;
          
        const imgHeight = y === verticalCount - 1 && y * (imageGridSize + imageSpacing) + imageGridSize > currentHeight
          ? currentHeight - (y * (imageGridSize + imageSpacing))
          : imageGridSize;
        
        // Skip images that would be completely off-page
        if (imgWidth <= 0 || imgHeight <= 0) continue;
        
        // Calculate position with spacing included
        const posX = x * (imageGridSize + imageSpacing);
        const posY = y * (imageGridSize + imageSpacing);
        
        // Skip images that would start beyond page boundaries
        if (posX >= currentWidth || posY >= currentHeight) continue;
        
        imageElements.push(
          <Image
            key={`${x}-${y}`}
            src={uploadedImages[0]}
            style={{
              position: 'absolute',
              left: posX,
              top: posY,
              width: imgWidth,
              height: imgHeight,
              opacity: imageOpacity,
              transform: `rotate(${imageAngle}deg)`,
              transformOrigin: 'center',
            }}
          />
        );
      }
    }
    
    return (
      <View style={styles.imageBackground}>
        {imageElements}
      </View>
    );
  };

  // Calculate letter size based on cell size
  const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, 1.3);
  const letterSize = cellSize * 0.6 * cappedLetterSizeMultiplier;
  
  // Create PDF styles
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Times-Roman',
      position: 'relative',
      overflow: 'hidden',
    },
    imageBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: currentWidth,
      height: currentHeight,
      zIndex: 0,
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
  });

  // Create a puzzle page with the given showSolution setting and puzzle
  const createPuzzlePage = (puzzleToRender: CrosswordGrid, index: number, showSolution: boolean) => (
    <Page key={`${index}-${showSolution ? 'solution' : 'puzzle'}`} size={[currentWidth, currentHeight]} style={styles.page} wrap={false}>
      {/* Tiled background pattern */}
      {uploadedImages && uploadedImages.length > 0 && createTiledBackground()}
      
      <View style={styles.container}>
        {showTitle && (
          <View style={[styles.titleContainer, {marginTop: getVerticalOffset(titleOffset)}]}>
            <Text style={styles.title}>
              {showSolution 
                ? `${title.toUpperCase()} - PAGE ${index + 1} SOLUTION` 
                : puzzlesToRender.length > 1 
                  ? `${title.toUpperCase()} - PAGE ${index + 1}` 
                  : title.toUpperCase()}
            </Text>
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
              {puzzleToRender.grid.map((row, i) => (
                <View key={i} style={styles.row}>
                  {row.map((cell, j) => {
                    const cellData = puzzleToRender.gridData[i][j];
                    
                    if (!cellData || cellData.isBlack) {
                      return <View key={`${i}-${j}`} style={styles.blackCell} />;
                    }
                    
                    return (
                      <View key={`${i}-${j}`} style={styles.cell}>
                        {cellData.number > 0 && (
                          <Text style={styles.cellNumber}>{cellData.number}</Text>
                        )}
                        <Text style={styles.letter}>
                          {showSolution ? cellData.letter : ''}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        )}
        
        {showWordList && (
          <View style={[styles.wordListContainer, {marginTop: getVerticalOffset(wordListOffset)}]}>
            <View style={styles.clueList}>
              <View style={styles.acrossClues}>
                <Text style={styles.clueHeading}>Across</Text>
                {puzzleToRender.acrossClues.map((clue) => (
                  <Text key={`across-${clue.number}`} style={styles.clueItem}>
                    {clue.number}. {clue.clue}
                  </Text>
                ))}
              </View>
              
              <View style={styles.downClues}>
                <Text style={styles.clueHeading}>Down</Text>
                {puzzleToRender.downClues.map((clue) => (
                  <Text key={`down-${clue.number}`} style={styles.clueItem}>
                    {clue.number}. {clue.clue}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </Page>
  );

  // Create all pages
  const pages = [];
  
  // Add all puzzles
  for (let i = 0; i < puzzlesToRender.length; i++) {
    pages.push(createPuzzlePage(puzzlesToRender[i], i, false));
    
    // Add solution pages if requested
    if (includeSolution) {
      pages.push(createPuzzlePage(puzzlesToRender[i], i, true));
    }
  }
  
  return <Document>{pages}</Document>;

  // Calculate vertical position offset
  function getVerticalOffset(offset: number) {
    const maxAllowedOffset = Math.min(5, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  }
};
