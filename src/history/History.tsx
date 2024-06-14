import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHistoryByCurrency } from "../api/currencyList";
import { Currency } from "../api/models/currency";
import "./history.css";

function History() {
  const { currency } = useParams();

  const [currencyHistory, setCurrencyHistory] = useState<Currency[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getHistoryByCurrency(currency!).then((data) => {
      setLoading(true);
      console.log(data);
      setCurrencyHistory(data);
      setLoading(false);
    });
  }, []);
  return (
    <div className="container">
      {currency}
      {loading && "LOADING"}
      {currencyHistory !== null && (
        <div>
          {currencyHistory.map((history, index) => (
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
      )}
    </div>
  );
}

export default History;
