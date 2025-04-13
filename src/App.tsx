import { useEffect, useState } from 'react';
import { Card } from '@chakra-ui/react';

import { useFetchData } from './hooks/useFetchData';
import LineChart from './components/LineChart';
import { LineData } from './types';
import './App.css'

const params = {
  latitude: 27.7017,
  longitude: 85.3206,
  hourly: ["precipitation_probability", "temperature_2m"],
  current: "temperature_2m",
  timezone: "auto",
  temperature_unit: "celsius",
  forecast_days: 1,
};

const API_ENDPOINT = import.meta.env.APP_API_ENDPOINT as string;
const url = `${API_ENDPOINT}/forecast`;
const urlParams = new URLSearchParams(params).toString();


function App() {
  const [data, setData] = useState<LineData[]>([]);
  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth * 0.9, 800),
    height: 400
  });

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
        precipitation: hourlyData?.precipitation_probability[index],
        temperature: hourlyData?.temperature_2m[index],
      }));

      setData(formattedData);
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

  return (
    <div className="p-6">
      <Card.Root className="rounded-2xl border border-gray-300 p-4 hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold underline">
            {`${weatherData?.current?.temperature_2m} ${weatherData?.current_units?.temperature_2m}`}
          </h1>
          <h2> {weatherData?.timezone} </h2>
        </div>
        <h2>Hourly temperature</h2>
        <LineChart
          data={data}
          width={dimensions.width}
          height={dimensions.height}
        />
      </Card.Root>
    </div>
  );
}

export default App
