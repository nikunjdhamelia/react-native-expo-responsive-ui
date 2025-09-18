// src/utils/responsive.ts
export function responsivePadding(padding: number, screenWidth: number) {
  return padding * (screenWidth / 375);
}

export function responsiveMargin(margin: number, screenWidth: number) {
  return margin * (screenWidth / 375);
}
