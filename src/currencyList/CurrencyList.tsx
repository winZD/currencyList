import { useEffect, useState } from "react";
import { Currency } from "../api/models/currency";
import getCurrency from "../api/currencyList";

function CurrencyList() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    getCurrency().then((data) => {
      setCurrencies(data);
    });
  }, []);
  return (
    <table>
      <thead>
        <tr>
          <th>Država</th>
          <th>Šifra valute</th>
          <th>Valuta</th>
          <th>Kupovni za devize</th>
          <th>Srednji za devize</th>
          <th>Prodajni za devize</th>
        </tr>
      </thead>
      <tbody>
        {currencies.map((value, key) => {
          return (
            <tr key={key}>
              <td>{value.drzava}</td>
              <td>{value.sifra_valute}</td>
              <td>{value.broj_tecajnice}</td>
              <td>{value.kupovni_tecaj}</td>
              <td>{value.srednji_tecaj}</td>
              <td>{value.prodajni_tecaj}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CurrencyList;
