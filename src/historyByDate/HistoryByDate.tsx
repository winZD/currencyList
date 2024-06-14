import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getHistoryByDate } from "../api/currencyList";

function HistoryByDate() {
  const { currency, date } = useParams();

  /*  const [currencyHistory, setCurrencyHistory] = useState<Currency[] | null>(
    null
  ); */
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getHistoryByDate(currency!, date || "").then((data) => {
      setLoading(true);
      console.log(data);

      setLoading(false);
    });
  }, []);
  return <div></div>;
}

export default HistoryByDate;
