// types/index.ts
export interface Settings {
  baseWidth: number;
  smallHeight: number;
  largeHeight: number;
  itemGap: number;
  hoverScale: number;
  expandedScale: number;
  dragEase: number;
  momentumFactor: number;
  bufferZone: number;
  borderRadius: number;
  vignetteSize: number;
  vignetteStrength: number;
  overlayOpacity: number;
  overlayEaseDuration: number;
  zoomDuration: number;
}

export interface ItemSize {
  width: number;
  height: number;
}

export interface VisibleItem {
  id: string;
  col: number;
  row: number;
  size: ItemSize;
  position: { x: number; y: number };
  dataIndex: number;
}

export interface ExpandedInfo {
  id: string;
  rect: DOMRect;
  imgSrc: string;
  width: number;
  height: number;
  dataIndex: number;
  nameText: string;
  numberText: string;
}