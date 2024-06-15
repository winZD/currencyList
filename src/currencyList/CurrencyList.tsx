import { useEffect, useState } from "react";
import { Currency } from "../api/models/currency";
import { getCurrency } from "../api/currencyList";
import { Link } from "react-router-dom";
import "./currencyList.css";

function CurrencyList() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getCurrency().then((data) => {
      setCurrencies(data);
    });
  }, []);
  return (
    <>
      <input
        value={date.toISOString().substring(0, 10)}
        type="date"
        onChange={(e) => setDate(new Date(e.target.value))}
      ></input>{" "}
      <button
        onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
      >
        Prev
      </button>
      <span>{date.toISOString().substring(0, 10)}</span>
      <button
        onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
      >
        Next
      </button>
      <Link to={`/povijest/${"USD"}/${date.toISOString().substring(0, 10)}`}>
        <button>Povijest</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Broj tečajnice</th>
            <th>Datum primjene</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>

            {/* <th>Valuta</th>
            <th>Kupovni za devize</th>
            <th>Srednji za devize</th>
            <th>Prodajni za devize</th> */}
          </tr>
        </thead>
        <tbody>
          {currencies.map((value, key) => {
            return (
              <tr key={key}>
                <td>{value.broj_tecajnice}</td>
                <td>{value.valuta}</td>
                <td>{value.datum_primjene}</td>
                <td>{value.broj_tecajnice}</td>
                <td>{value.kupovni_tecaj}</td>
                <td>{value.srednji_tecaj}</td>
                <td>{value.prodajni_tecaj}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default CurrencyList;
