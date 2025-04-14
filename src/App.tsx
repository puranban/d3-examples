import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarData, LineData, ScatterData } from '@/types';
import LineChart from '@/components/LineChart';
import BarChart from '@/components/Barchart';
import ScatterPlot from '@/components/ScatterPlot';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

import { useFetchData } from './hooks/useFetchData';
import './App.css'

const API_ENDPOINT = import.meta.env.APP_API_ENDPOINT as string;
const url = `${API_ENDPOINT}/forecast`;

function App() {
  const [LineChartData, setLineChartData] = useState<LineData[]>([]);
  const [barChartData, setBarChartData] = useState<BarData[]>([]);
  const [scatterPlotData, setScatterPlotData] = useState<ScatterData[]>([]);
  const [filterValue, setFilterValue] = useState("7");

  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth * 0.9, 600),
    height: 400
  });

  const params = useMemo(
    () => ({
      latitude: 27.7017,
      longitude: 85.3206,
      hourly: ["precipitation_probability", "temperature_2m"],
      current: "temperature_2m",
      timezone: "auto",
      temperature_unit: "celsius",
      daily: ["temperature_2m_max","precipitation_probability_max", "relative_humidity_2m_max"],
      forecast_days: filterValue,
    }),
    [filterValue],
  );

  const urlParams = new URLSearchParams(params).toString();

  const {
    loading,
    data: weatherData,
  } = useFetchData(url, urlParams);

  useEffect(
    () => {
      if (!weatherData || weatherData.length === 0) {
        return;
      }
      const hourlyData = weatherData?.hourly;

      const formattedData = Object.keys(hourlyData?.time)?.map(
        (_, index) => ({
          date: hourlyData?.time[index],
          temperature: hourlyData?.temperature_2m[index],
        }),
      ) as LineData[];

      const dailyData = weatherData?.daily;
      const formattedBarChartData = Object.keys(dailyData?.time)?.map(
        (_, index) => ({
          date: dailyData?.time[index],
          precipitation: dailyData?.precipitation_probability_max[index],
          temperature: dailyData?.temperature_2m_max[index],
        }),
      ) as BarData[];

      const formattedScatterPlotData = Object.keys(dailyData?.time)?.map(
        (_, index) => ({
          date: dailyData?.time[index],
          precipitation: dailyData?.precipitation_probability_max[index],
          temperature: dailyData?.temperature_2m_max[index],
          humidity: dailyData?.relative_humidity_2m_max[index],
        }),
      ) as ScatterData[];

      setLineChartData(formattedData);
      setBarChartData(formattedBarChartData);
      setScatterPlotData(formattedScatterPlotData);

    },
    [weatherData],
  );

  console.log('dimension', dimensions);
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth * 0.9, 600),
        height: 400
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (val: string) => {
    setFilterValue(val);
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      <CardHeader>
        <CardTitle>{ weatherData?.timezone }</CardTitle>
        <CardDescription>
          {`${weatherData?.current?.temperature_2m} ${weatherData?.current_units?.temperature_2m}`}
        </CardDescription>
      </CardHeader>

      {/* Forecast filter select */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="select">Select Forecast Days </Label>
        <Select value={filterValue} onValueChange={handleChange}>
          <SelectTrigger className="min-w-[300px]">
            <SelectValue placeholder="Select forecast days" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel> Select Forecast Days </SelectLabel>
              <SelectItem value="1">1 day</SelectItem>
              <SelectItem value="3">3 days</SelectItem>
              <SelectItem value="7">7 days (default)</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="16">16 days</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Line Chart */}
      <div className="flex flex-wrap gap-6">
        <Card className="w-full xl:w-[calc(50%-0.75rem)] bg-gray-100 shadow-xl rounded-2xl border border-gray-300">
          <CardHeader>
            <CardTitle>Hourly Temperature Trends</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col self-center justify-center min-h-[400px]">
            {loading && (
              <Progress  />
            )}
            <LineChart
              data={LineChartData}
              width={dimensions.width}
              height={dimensions.height}
            />
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="w-full xl:w-[calc(50%-0.75rem)] bg-gray-100 shadow-xl rounded-2xl border border-gray-300">
          <CardHeader>
            <CardTitle>Temperature and Precipitation </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col self-center justify-center min-h-[400px]">
            {loading && (
              <Progress  />
            )}
            <BarChart
              data={barChartData}
              width={dimensions.width}
              height={dimensions.height}
            />
          </CardContent>
        </Card>

        {/* Scatter Plot Chart */}
        <Card className="w-full xl:w-[calc(50%-0.75rem)] bg-gray-100 shadow-xl rounded-2xl border border-gray-300">
          <CardHeader>
            <CardTitle>Precipitation Probability vs. Relative Humidity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col self-center justify-center min-h-[400px]">
            {loading && (
              <Progress  />
            )}
            <ScatterPlot
              data={scatterPlotData}
              width={dimensions.width}
              height={dimensions.height}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App
