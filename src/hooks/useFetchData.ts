import { WeatherApiResponse } from "@/types";
import { useEffect, useState } from "react";

export const useFetchData = (url: string, params: string) => {
  const [data, setData] = useState<WeatherApiResponse>();
  const[loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async() => {
      setLoading(true);
      try {
        const responses = await fetch(`${url}?${params}`);
        const response = await responses.json() as WeatherApiResponse;
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    getData();
  },
    [url, params],
  );

  return { loading, data };
}
