
import { View, Text } from "@react-pdf/renderer";
import { CrosswordGrid } from "@/utils/crosswordUtils";

interface PDFCrosswordClueListProps {
  puzzle: CrosswordGrid;
  styles: any; // StyleSheet from parent component
}

export const PDFCrosswordClueList = ({
  puzzle,
  styles,
}: PDFCrosswordClueListProps) => {
  return (
    <View style={styles.clueList}>
      <View style={styles.acrossClues}>
        <Text style={styles.clueHeading}>Across</Text>
        {puzzle.acrossClues.map((clue) => (
          <Text key={`across-${clue.number}`} style={styles.clueItem}>
            {clue.number}. {clue.clue}
          </Text>
        ))}
      </View>
      
      <View style={styles.downClues}>
        <Text style={styles.clueHeading}>Down</Text>
        {puzzle.downClues.map((clue) => (
          <Text key={`down-${clue.number}`} style={styles.clueItem}>
            {clue.number}. {clue.clue}
          </Text>
        ))}
      </View>
    </View>
  );
};
