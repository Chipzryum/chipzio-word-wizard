
import { View, Image, StyleSheet } from "@react-pdf/renderer";

interface PDFTiledBackgroundProps {
  uploadedImages: string[];
  currentWidth: number;
  currentHeight: number;
  imageGridSize: number;
  imageSpacing: number;
  imageOpacity: number;
  imageAngle: number;
}

export const PDFTiledBackground = ({
  uploadedImages,
  currentWidth,
  currentHeight,
  imageGridSize,
  imageSpacing,
  imageOpacity,
  imageAngle,
}: PDFTiledBackgroundProps) => {
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
  
  const styles = StyleSheet.create({
    imageBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: currentWidth,
      height: currentHeight,
      zIndex: 0,
      overflow: 'hidden',
    },
  });
  
  return (
    <View style={styles.imageBackground}>
      {imageElements}
    </View>
  );
};
