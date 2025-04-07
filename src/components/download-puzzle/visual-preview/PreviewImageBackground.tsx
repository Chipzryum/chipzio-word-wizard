
import { ReactNode } from "react";

interface PreviewImageBackgroundProps {
  uploadedImages: string[];
  currentWidth: number;
  currentHeight: number;
  imageGridSize: number;
  imageSpacing: number;
  imageOpacity: number;
  imageAngle: number;
  previewScaleFactor: number;
  children: ReactNode;
}

export const PreviewImageBackground = ({
  uploadedImages,
  currentWidth,
  currentHeight,
  imageGridSize,
  imageSpacing,
  imageOpacity,
  imageAngle,
  previewScaleFactor,
  children
}: PreviewImageBackgroundProps) => {
  // Create a tiled background similar to the PDF version
  const createTiledBackground = () => {
    if (!uploadedImages || uploadedImages.length === 0) return null;
    
    const imageElements = [];
    
    // Calculate number of images needed to cover the preview completely with spacing
    const adjustedImageSize = imageGridSize * previewScaleFactor;
    const adjustedSpacing = imageSpacing * previewScaleFactor;
    const totalImageSize = adjustedImageSize + adjustedSpacing;
    
    // Add extra rows/columns to ensure rotation covers the entire page
    const extraCoverForRotation = imageAngle > 0 ? 2 : 0;
    const horizontalCount = Math.ceil(currentWidth * previewScaleFactor / totalImageSize) + extraCoverForRotation;
    const verticalCount = Math.ceil(currentHeight * previewScaleFactor / totalImageSize) + extraCoverForRotation;
    
    // Starting position offset for rotation coverage
    const offsetX = imageAngle > 0 ? -adjustedImageSize : 0;
    const offsetY = imageAngle > 0 ? -adjustedImageSize : 0;
    
    for (let y = 0; y < verticalCount; y++) {
      for (let x = 0; x < horizontalCount; x++) {
        const posX = offsetX + x * (adjustedImageSize + adjustedSpacing);
        const posY = offsetY + y * (adjustedImageSize + adjustedSpacing);
        
        imageElements.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: `${posX}px`,
              top: `${posY}px`,
              width: `${adjustedImageSize}px`,
              height: `${adjustedImageSize}px`,
              backgroundImage: `url(${uploadedImages[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: imageOpacity,
              transform: `rotate(${imageAngle}deg)`,
              transformOrigin: 'center',
            }}
          />
        );
      }
    }
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {imageElements}
      </div>
    );
  };

  return (
    <>
      {uploadedImages && uploadedImages.length > 0 && createTiledBackground()}
      {children}
    </>
  );
};
