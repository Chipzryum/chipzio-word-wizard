
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { CrosswordGrid } from "@/utils/crosswordUtils";

interface PDFCrosswordGridProps {
  puzzle: CrosswordGrid;
  cellSize: number;
  letterSize: number;
  showSolution: boolean;
}

export const PDFCrosswordGrid = ({
  puzzle,
  cellSize,
  letterSize,
  showSolution,
}: PDFCrosswordGridProps) => {
  // Create styles specific to the grid
  const styles = StyleSheet.create({
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
      position: 'relative',
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
      zIndex: 3,
    },
    cellNumber: {
      position: 'absolute',
      top: 1,
      left: 1,
      fontSize: letterSize * 0.4,
      zIndex: 2,
    },
    solutionHighlight: {
      position: 'absolute',
      backgroundColor: 'rgba(239, 68, 68, 0.3)',
      width: '100%',
      height: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    },
  });

  return (
    <>
      {puzzle.grid.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((cell, j) => {
            const cellData = puzzle.gridData[i][j];
            
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
                {/* Add red line for solution pages */}
                {showSolution && cellData.letter && (
                  <View style={styles.solutionHighlight} />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
};
