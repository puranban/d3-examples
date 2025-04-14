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

// Tooltip types
export interface TooltipProps {
  x: number;
  y: number;
  content: React.ReactNode;
  visible: boolean;
}

// Current weather conditions
export interface CurrentWeather {
  time: string; // ISO8601
  interval: number; // seconds
  temperature_2m: number;
}

// Hourly forecast data
export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
}

// Daily forecast data
export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  precipitation_probability_max: number[];
  relative_humidity_2m_max: number[];
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  precipitation_probability: string;
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  precipitation_probability_max: string;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units: CurrentUnits;
  current: CurrentWeather;

  hourly_units: HourlyUnits;
  hourly: HourlyWeather;

  daily_units: DailyUnits;
  daily: DailyWeather;
}
