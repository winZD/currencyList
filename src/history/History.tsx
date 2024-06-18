import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getExchangeRateDifferences,
  getHistoryByCurrency,
} from "../api/currencyList";
import { Currency } from "../api/models/currency";
import "./history.css";
import { days } from "../api/daysData";

function History() {
  const { currency } = useParams();
  const location = useLocation();
  const [dateTo, setDateTo] = useState(new Date());
  const [daysBefore, setDaysBefore] = useState("4");
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
  }, [currency]);
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDaysBefore(event.target.value);
  };
  const fetchExchangeRateDifferences = async (
    dateFrom: string,
    dateTo: string
  ) => {
    return await getExchangeRateDifferences(dateFrom, dateTo);
  };

  console.log(location);
  return (
    <div className="container">
      <h1>Povijest valuta</h1>
      <button onClick={() => ""}>Povijest tečajnih razlika </button>

      <input
        disabled={
          location.state?.params.currency || location.state?.params.cdate
        }
        value={dateTo.toISOString().substring(0, 10)}
        type="date"
        onChange={(e) => setDateTo(new Date(e.target.value))}
      ></input>

      <div>
        <select value={daysBefore} onChange={handleChange}>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        {/*  <p>Selected day: {daysBefore}</p> */}
      </div>
      {loading && "LOADING..."}

      <table>
        <thead>
          <tr>
            <th>Broj tečajnice</th>
            <th>Datum primjene </th>
            <th>Valuta</th>
            <th>Država</th>
            <th>Kupovni za devize</th>
            <th>Srednji za devize</th>
            <th>Prodajni za devize</th>
          </tr>
        </thead>
        <tbody>
          {currencyHistory !== null &&
            currencyHistory.map((value, index) => (
              <tr key={index}>
                <td>{value.broj_tecajnice}</td>
                <td>{value.datum_primjene}</td>
                <td>{value.valuta}</td>
                <td>{value.drzava}</td>
                <td>{value.kupovni_tecaj}</td>
                <td>{value.srednji_tecaj}</td>
                <td>{value.prodajni_tecaj}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
