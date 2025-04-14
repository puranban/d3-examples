// Data types for our charts
export interface LineData {
  date: string;
  temperature: number,
}

export interface BarData {
  date: string;
  temperature: number;
  precipitation: number;
}

export interface ScatterData {
  date: string;
  temperature: number;
  precipitation: number;
  humidity: number;
}

export interface ChartData {
  barData: BarData[];
  lineData: LineData[];
  scatterData: ScatterData[];
}

// Props for our chart components
export interface ChartProps<T> {
  data: T[]; // Will be more specific in each component
  width: number;
  height: number;
}

// Tooltip types
export interface TooltipProps {
  x: number;
  y: number;
  content: React.ReactNode;
  visible: boolean;
}
