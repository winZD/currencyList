import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getHistoryByDate } from "../api/currencyList";
import { Currency } from "../api/models/currency";

function HistoryByDate() {
  const { currency, date } = useParams();

  const [historyByDate, setHistoryByDate] = useState<Currency[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getHistoryByDate(currency!, date || "").then((data) => {
      setLoading(true);
      console.log(data);
      setHistoryByDate(data);
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {historyByDate!.map((history, index) => (
        <div className="card" key={index}>
          <span>{history?.drzava}</span>
          <span>{history?.broj_tecajnice}</span>
          <span>{history?.kupovni_tecaj}</span>
          <span>{history?.prodajni_tecaj}</span>
          <span>{history?.sifra_valute}</span>
          <span>{history?.srednji_tecaj}</span>
        </div>
      ))}
    </div>
  );
}

export default HistoryByDate;
