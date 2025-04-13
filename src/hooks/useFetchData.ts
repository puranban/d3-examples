import { useEffect, useState } from "react";

export const useFetchData = (url: string, params: string) => {
  const [data, setData] = useState([]);
  const[loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async() => {
      setLoading(true);
      try {
        const responses = await fetch(`${url}?${params}`);
        const response = await responses.json();
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
