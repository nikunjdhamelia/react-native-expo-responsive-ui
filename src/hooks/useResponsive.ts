// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface FoldInfo {
  isFoldable: boolean;
  isFolded: boolean;
  hingeRect: { x: number; y: number; width: number; height: number } | null;
  orientation: 'portrait' | 'landscape';
}

const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

function getOrientation({ width, height }: ScaledSize) {
  return width < height ? 'portrait' : 'landscape';
}

function detectFoldable(dim: ScaledSize): FoldInfo {
  // Simple heuristic: If width drastically changes without orientation change,
  // or aspect ratio has certain foldable characteristics, assume foldable device.

  // These numbers can be adjusted based on foldable device benchmarks.

  const aspectRatio = dim.width / dim.height;
  let isFoldable = false;
  let isFolded = false;
  let hingeRect = null;

  // Example heuristic:
  // Foldable devices often have aspect ratios near 1.5 folded, near 2.0 unfolded
  // If aspect ratio or width changes in typical foldable patterns, detect fold

  if (aspectRatio > 1.6) {
    isFoldable = true;
    isFolded = false;
  } else if (aspectRatio < 1.2) {
    isFoldable = true;
    isFolded = true;
  }

  // Hinge position heuristic (center vertical line for foldable in landscape)
  if (isFoldable) {
    if (getOrientation(dim) === 'landscape') {
      // vertical hinge centered in width, with small hinge width
      hingeRect = {
        x: dim.width / 2 - 20,
        y: 0,
        width: 40,
        height: dim.height,
      };
    } else {
      // horizontal hinge centered
      hingeRect = {
        x: 0,
        y: dim.height / 2 - 20,
        width: dim.width,
        height: 40,
      };
    }
  }

  return {
    isFoldable,
    isFolded,
    hingeRect,
    orientation: getOrientation(dim),
  };
}

export function useResponsive() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [foldInfo, setFoldInfo] = useState<FoldInfo>(
    detectFoldable(dimensions)
  );

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize; screen: ScaledSize }) => {
      setDimensions(window);
      setFoldInfo(detectFoldable(window));
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Responsive scale functions
  const scaleWidth = (size: number) =>
    (dimensions.width / GUIDELINE_BASE_WIDTH) * size;
  const scaleHeight = (size: number) =>
    (dimensions.height / GUIDELINE_BASE_HEIGHT) * size;
  const scaleFont = (size: number) =>
    Math.min(scaleWidth(size), scaleHeight(size));

  return {
    width: dimensions.width,
    height: dimensions.height,
    foldInfo,
    scaleWidth,
    scaleHeight,
    scaleFont,
  };
}
