export interface MapAppearance {
  regionFill?: string
  regionHoverFill?: string
  regionSelectedFill?: string
  borderColor?: string
  waterColor?: string
  showWaterLabels?: boolean
  showRegionLabels?: boolean
  backgroundColor?: string
}

export const defaultMapAppearance: Required<MapAppearance> = {
  regionFill: '#d9e6d6',
  regionHoverFill: '#9ec69a',
  regionSelectedFill: '#3f8054',
  borderColor: '#fbfcf8',
  waterColor: '#4a7890',
  showWaterLabels: true,
  showRegionLabels: true,
  backgroundColor: '#f6faf6',
}
