import React, { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import {
  getExchangeRateDifferences,
  getHistoryByDate,
} from "../api/currencyList";
import { Currency } from "../api/models/currency";
import { days } from "../api/daysData";

function HistoryByDate() {
  const { currency, date } = useParams();

  const [historyByDate, setHistoryByDate] = useState<Currency[] | null>([]);
  const [dateTo, setDateTo] = useState(new Date());

  const [loading, setLoading] = useState<boolean>(false);

  const [daysBefore, setDaysBefore] = useState("4");
  const location = useLocation();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDaysBefore(event.target.value);
  };

  const fetchExchangeRateDifferences = async (
    dateFrom: string,
    dateTo: string
  ) => {
    return await getExchangeRateDifferences(dateFrom, dateTo).then((data) => {
      setHistoryByDate(data);
    });
  };
  useEffect(() => {
    getHistoryByDate(currency!, date || "").then((data) => {
      setLoading(true);

      setHistoryByDate(data);
      setLoading(false);
    });
  }, []);

  // Group by 'broj_tecajnice' and keep the first entry of each group
  /* const groupedByBrojTecajnice = historyByDate!.reduce((acc, curr) => {
    if (!acc.has(curr.broj_tecajnice)) {
      acc.set(curr.broj_tecajnice, curr);
    } else {
      const existingEntry = acc.get(curr.broj_tecajnice);
      if (
        new Date(existingEntry.datum_primjene) > new Date(curr.datum_primjene)
      ) {
        acc.set(curr.broj_tecajnice, curr);
      }
    }
    return acc;
  }, new Map()); */

  const groupedByExchangeRateNumber = (data: Currency[]): Currency[] => {
    const groupedExchangeRateNumber = data.reduce((acc, curr) => {
      if (!acc.has(curr.broj_tecajnice)) {
        acc.set(curr.broj_tecajnice, curr);
      } else {
        const existingEntry = acc.get(curr.broj_tecajnice);
        if (
          new Date(existingEntry.datum_primjene) > new Date(curr.datum_primjene)
        ) {
          acc.set(curr.broj_tecajnice, curr);
        }
      }
      return acc;
    }, new Map());
    const uniqueEntries = Array.from(groupedExchangeRateNumber.values()).sort(
      (a, b) =>
        new Date(a.datum_primjene).getTime() -
        new Date(b.datum_primjene).getTime()
    );

    return uniqueEntries;
  };
  const calculateColor = (
    currentValue: string,
    previousValue: string | undefined
  ) => {
    console.log(
      `Current Value: ${currentValue}, Previous Value: ${previousValue}`
    ); // Debugging output

    if (!previousValue) return "transparent"; // No previous value, so no change

    const cleanedCurrentValue = currentValue.replace(",", ".");
    const cleanedPreviousValue = previousValue.replace(",", ".");

    const currentValueFloat = Number(cleanedCurrentValue);
    const previousValueFloat = Number(cleanedPreviousValue);

    if (isNaN(currentValueFloat) || isNaN(previousValueFloat)) {
      console.error("Invalid numeric value found"); // Error handling for non-numeric values
      return "yellow";
    }

    if (currentValueFloat > previousValueFloat) {
      return "green"; // Increase
    } else if (currentValueFloat < previousValueFloat) {
      console.log("---------------------------------");
      console.log(currentValueFloat);
      console.log(previousValueFloat);
      console.log("---------------------------------");
      return "red"; // Decrease
    } else {
      return "black"; // No change
    }
  };

  return (
    <div>
      <h1>HISTORY BY DATE</h1>
      <input
        value={dateTo.toISOString().substring(0, 10)}
        type="date"
        onChange={(e) => setDateTo(new Date(e.target.value))}
      ></input>
      <div>
        <select
          value={daysBefore}
          disabled={location.state?.prev === "/tecaj"}
          onChange={handleChange}
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <p>Selected day: {daysBefore}</p>
      </div>
      <button
        onClick={() => {
          const dateFrom = new Date();

          dateFrom.setDate(dateTo.getDate() - Number(daysBefore));

          fetchExchangeRateDifferences(
            dateFrom.toISOString().substring(0, 10),
            dateTo.toISOString().substring(0, 10)
          );
        }}
      >
        Povijest tečajnih razlika{" "}
      </button>
      {/* {historyByDate!.map((history, index) => (
        <div className="card" key={index}>
          <span>{history?.drzava}</span>
          <span>{history?.broj_tecajnice}</span>
          <span>{history?.kupovni_tecaj}</span>
          <span>{history?.prodajni_tecaj}</span>
          <span>{history?.sifra_valute}</span>
          <span>{history?.srednji_tecaj}</span>
        </div>
      ))} */}

      <table>
        <thead>
          <tr>
            <th>Broj tečajnice</th>
            <th>Datum primjene </th>

            <th>Valuta</th>
            <th>Kupovni za devize</th>
            <th>Srednji za devize</th>
            <th>Prodajni za devize</th>
          </tr>
        </thead>
        <tbody>
          {groupedByExchangeRateNumber(
            historyByDate!.filter((data) => data.valuta === "USD")
          ).map((value, index) => {
            const prevValue =
              index > 0
                ? groupedByExchangeRateNumber(
                    historyByDate!.filter((data) => data.valuta === "USD")
                  )[index - 1]
                : null;

            console.log(prevValue);

            const cleanedCurrentValue = value?.kupovni_tecaj.replace(",", ".");
            const cleanedPreviousValue = prevValue?.kupovni_tecaj.replace(
              ",",
              "."
            );
            const relativeChange = prevValue?.kupovni_tecaj
              ? (
                  (Number(cleanedCurrentValue) / Number(cleanedPreviousValue) -
                    1) *
                  100
                ).toFixed(2)
              : "N/A";

            return (
              <tr key={index}>
                <td>{value.broj_tecajnice}</td>
                <td>{value.datum_primjene}</td>
                <td>{value.valuta}</td>
                <td>{value.drzava}</td>
                <td>{value.broj_tecajnice}</td>
                <td
                  style={{
                    background: calculateColor(
                      value.kupovni_tecaj,
                      prevValue?.kupovni_tecaj
                    ),
                  }}
                >
                  {value.kupovni_tecaj}
                </td>
                <td
                  style={{
                    background: calculateColor(
                      value.srednji_tecaj,
                      prevValue?.srednji_tecaj
                    ),
                  }}
                >
                  {value.srednji_tecaj}
                </td>
                <td
                  style={{
                    background: calculateColor(
                      value.prodajni_tecaj,
                      prevValue?.srednji_tecaj
                    ),
                  }}
                >
                  {value.prodajni_tecaj}
                </td>
                <td>{relativeChange}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryByDate;
