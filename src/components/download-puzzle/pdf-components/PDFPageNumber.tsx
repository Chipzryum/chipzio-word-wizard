
import { Text, StyleSheet } from "@react-pdf/renderer";

interface PDFPageNumberProps {
  label: string;
}

export const PDFPageNumber = ({ label }: PDFPageNumberProps) => {
  const styles = StyleSheet.create({
    pageNumber: {
      position: 'absolute',
      bottom: 30,
      right: 40,
      fontSize: 10,
      color: '#666',
    },
  });

  return <Text style={styles.pageNumber}>{label}</Text>;
};
