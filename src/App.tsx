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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useFetchData } from './hooks/useFetchData';
import { BarData, LineData, ScatterData } from './types';
import LineChart from '@/components/LineChart';
import BarChart from '@/components/Barchart';
import ScatterPlot from '@/components/ScatterPlot';

import './App.css'

const API_ENDPOINT = import.meta.env.APP_API_ENDPOINT as string;
const url = `${API_ENDPOINT}/forecast`;


function App() {
  const [LineChartData, setLineChartData] = useState<LineData[]>([]);
  const [barChartData, setBarChartData] = useState<BarData[]>([]);
  const [scatterPlotData, setScatterPlotData] = useState<ScatterData[]>([]);
  const [filterValue, setFilterValue] = useState("1");

  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth * 0.9, 800),
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

  const {loading, data: weatherData} = useFetchData(url, urlParams);

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

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth * 0.9, 800),
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
      <Select value={filterValue} onValueChange={handleChange}>
        <SelectTrigger className="min-w-[300px]">
          <SelectValue placeholder="Select forecast days" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">1 day</SelectItem>
            <SelectItem value="3">3 days</SelectItem>
            <SelectItem value="7">7 days (default)</SelectItem>
            <SelectItem value="14">14 days</SelectItem>
            <SelectItem value="16">16 days</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Line Chart */}
      <Card className="bg-gray-100 shadow-xl rounded-2xl border border-gray-300">
        <CardHeader>
          <CardTitle>Hourly Temperature Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <h2>Hourly temperature</h2>
          <LineChart
            data={LineChartData}
            width={dimensions.width}
            height={dimensions.height}
          />
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="bg-gray-100 shadow-xl rounded-2xl border border-gray-300">
        <CardHeader>
          <CardTitle>Temperature and Precipitation </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={barChartData}
            width={dimensions.width}
            height={dimensions.height}
          />
        </CardContent>
      </Card>

      {/* Scatter Plot Chart */}
      <Card className="bg-gray-100 shadow-xl rounded-2xl border border-gray-300">
        <CardHeader>
          <CardTitle>Precipitation Probability vs. Relative Humidity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScatterPlot
            data={scatterPlotData}
            width={dimensions.width}
            height={dimensions.height}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App
