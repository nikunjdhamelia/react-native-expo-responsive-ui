# react-native-expo-responsive-ui

Responsive UI library for React Native Expo apps with built-in foldable device support.

## Description

This solution uses **only React Native's built-in `Dimensions` API** and heuristics for fold detection.
Responsive scaling is based on guideline device dimensions (iPhone 11 size).
Fold detection heuristics use aspect ratio to infer folded vs unfolded states and hinge rect for layout adjustments.
No external packages or native code — fully Expo compatible.
Ready to package as an npm library for React Native Expo projects targeting all devices including foldables.

---

## Installation

npm install react-native-expo-responsive-ui
or
yarn add react-native-expo-responsive-ui


---

## API

### `useResponsive()`

Returns an object with:

- **width**: current screen/window width
- **height**: current screen/window height
- **foldInfo**: information about foldable device state
  - `isFoldable`: boolean if device is foldable
  - `isFolded`: boolean if device is currently folded
  - `hingeRect`: `{ x, y, width, height }` region of hinge (if detected)
  - `orientation`: `'portrait' | 'landscape'`
- **scaleWidth(size: number)**: scales width according to device size
- **scaleHeight(size: number)**: scales height according to device size
- **scaleFont(size: number)**: scales font size responsively

---

## Usage Example

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useResponsive } from 'react-native-expo-responsive-ui';

export default function DemoComponent() {
const { foldInfo, scaleFont, scaleWidth, width, height } = useResponsive();

// If foldable and hinge present, add margin to avoid hinge
const hingeMarginStyle = foldInfo.isFoldable && foldInfo.hingeRect
? foldInfo.orientation === 'landscape'
? { marginLeft: foldInfo.hingeRect.width }
: { marginTop: foldInfo.hingeRect.height }
: {};

return (
<View style={[styles.container, { padding: scaleWidth(16) }, hingeMarginStyle]}>
<Text style={{ fontSize: scaleFont(18) }}>
Responsive and Foldable-aware Text
</Text>
<Text>Foldable: {foldInfo.isFoldable ? 'Yes' : 'No'}</Text>
<Text>Folded: {foldInfo.isFolded ? 'Yes' : 'No'}</Text>
<Text>Orientation: {foldInfo.orientation}</Text>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
},
});

---

## Notes

- The library does **not** use any third-party dependencies or native code, ensuring compatibility with Expo-managed workflows.
- Fold detection uses aspect ratio heuristics and window dimension changes to infer fold states and avoid hinge areas.
- Designed to support all devices, including foldables, tablets, and phones with a unified responsive API.

---

## License

MIT License.

---

Feel free to contribute and report issues!