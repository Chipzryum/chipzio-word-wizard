import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CrosswordGrid, isWordStart } from "@/utils/crosswordUtils";

interface CrosswordPDFPreviewProps {
  puzzle: CrosswordGrid | null;
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
      numberSize: Math.max(6, Math.min(12, Math.floor(8 * sizeRatio))),
    };
  };

  const fontSizes = calculateFontSizes();
  
  // Use the exact font sizes from our calculations
  const pdfStyles = createPDFStyles(fontSizes);

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
      <View style={pdfStyles.imageBackground}>
        {imageElements}
      </View>
    );
  };

  // Categorize word placements by direction
  const acrossClues = puzzle.wordPlacements
    .filter(placement => placement.direction === 'across')
    .sort((a, b) => (a.number || 0) - (b.number || 0));
    
  const downClues = puzzle.wordPlacements
    .filter(placement => placement.direction === 'down')
    .sort((a, b) => (a.number || 0) - (b.number || 0));
  
  // Create a puzzle page with the given showSolution setting
  const createPuzzlePage = (forSolution: boolean) => (
    <Page size={[currentWidth, currentHeight]} style={pdfStyles.page} wrap={false}>
      {/* Tiled background pattern */}
      {uploadedImages && uploadedImages.length > 0 && createTiledBackground()}
      
      <View style={pdfStyles.container}>
        {showTitle && (
          <View style={[pdfStyles.titleContainer, {marginTop: getVerticalOffset(titleOffset)}]}>
            <Text style={pdfStyles.title}>
              {forSolution ? `${title.toUpperCase()} - SOLUTION` : title.toUpperCase()}
            </Text>
          </View>
        )}
        
        {showSubtitle && (
          <View style={[pdfStyles.subtitleContainer, {marginTop: getVerticalOffset(subtitleOffset)}]}>
            <Text style={pdfStyles.subtitle}>{subtitle.toLowerCase()}</Text>
          </View>
        )}
        
        {showInstruction && !forSolution && (
          <View style={[pdfStyles.instructionContainer, {marginTop: getVerticalOffset(instructionOffset)}]}>
            <Text style={pdfStyles.instruction}>{instruction}</Text>
          </View>
        )}
        
        {showGrid && (
          <View style={[pdfStyles.gridContainer, {marginTop: getVerticalOffset(gridOffset)}]}>
            <View style={pdfStyles.grid}>
              {puzzle.grid.map((row, i) => (
                <View key={i} style={pdfStyles.row}>
                  {row.map((cell, j) => {
                    const wordNumber = isWordStart(puzzle.wordPlacements, i, j);
                    const isEmpty = cell === '';
                    
                    return (
                      <View key={`${i}-${j}`} style={[
                        pdfStyles.cell,
                        isEmpty ? pdfStyles.emptyCell : null
                      ]}>
                        {wordNumber !== null && (
                          <Text style={pdfStyles.cellNumber}>{wordNumber}</Text>
                        )}
                        {!isEmpty && forSolution && (
                          <Text style={pdfStyles.letter}>{cell}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        )}
        
        {showWordList && (
          <View style={[pdfStyles.wordListContainer, {marginTop: getVerticalOffset(wordListOffset)}]}>
            <View style={pdfStyles.cluesContainer}>
              <View style={pdfStyles.clueColumn}>
                <Text style={pdfStyles.clueHeader}>ACROSS</Text>
                {acrossClues.map((placement) => (
                  <Text key={`across-${placement.number}`} style={pdfStyles.clueItem}>
                    {placement.number}. {placement.clue}
                    {forSolution ? ` (${placement.word})` : ''}
                  </Text>
                ))}
              </View>
              
              <View style={pdfStyles.clueColumn}>
                <Text style={pdfStyles.clueHeader}>DOWN</Text>
                {downClues.map((placement) => (
                  <Text key={`down-${placement.number}`} style={pdfStyles.clueItem}>
                    {placement.number}. {placement.clue}
                    {forSolution ? ` (${placement.word})` : ''}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </Page>
  );
  
  // Ensure we're creating both pages: worksheet and solution
  return (
    <Document>
      {createPuzzlePage(false)}
      {includeSolution && createPuzzlePage(true)}
    </Document>
  );

  // Create styles for PDF
  function createPDFStyles(fontSizes: { 
    titleSize: number; 
    subtitleSize: number; 
    instructionSize: number; 
    wordListSize: number;
    numberSize: number;
  }) {
    // Apply the exact multipliers as in the preview
    // The letter size calculation remains based on cell size
    const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, 1.3);
    const letterSize = cellSize * 0.6 * cappedLetterSizeMultiplier;
    
    return StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        position: 'relative',
        overflow: 'hidden', // Prevent content from overflowing to next page
      },
      imageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: currentWidth,
        height: currentHeight,
        zIndex: 0,
        overflow: 'hidden', // Ensure background stays within page
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
        marginTop: 20,
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
        borderColor: '#000',
        position: 'relative',
      },
      emptyCell: {
        backgroundColor: 'rgba(0, 0, 0, 1)',
      },
      cellNumber: {
        position: 'absolute',
        top: 1,
        left: 1,
        fontSize: fontSizes.numberSize,
        textAlign: 'left',
      },
      letter: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: letterSize,
      },
      cluesContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      clueColumn: {
        width: '48%',
        marginBottom: 10,
      },
      clueHeader: {
        fontSize: fontSizes.wordListSize * 1.2,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      clueItem: {
        fontSize: fontSizes.wordListSize,
        marginBottom: 3,
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
