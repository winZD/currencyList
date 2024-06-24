import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router";
import { getExchangeRateDifferences } from "../api/currencyList";
import { Currency } from "../api/models/currency";
import { days } from "../api/daysData";
import "./historyByDate.css";

function HistoryByDate() {
  const { currency, "*": date } = useParams();

  const [historyByDate, setHistoryByDate] = useState<Currency[] | null>([]);
  const [dateTo, setDateTo] = useState(date ? new Date(date) : new Date());

  const [loading, setLoading] = useState<boolean>(false);

  const [daysBefore, setDaysBefore] = useState("2");

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
    setLoading(true);
    const dateFrom = date ? new Date(date!) : new Date();

    dateFrom.setDate(dateTo.getDate() - Number(daysBefore));
    getExchangeRateDifferences(
      dateFrom.toISOString().substring(0, 10),
      dateTo.toISOString().substring(0, 10)
    ).then((data) => {
      setHistoryByDate(data);
      setLoading(false);
    });
  }, []);

  /**
   * Groups currency data by exchange rate number and returns the latest entry for each group based on the transaction date.
   *
   * @param {Currency[]} data - An array of currency objects where each object represents a currency.
   * @returns {Currency[]} An array of unique currency entries sorted by the transaction date in descending order.
   */
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
        new Date(b.datum_primjene).getTime() -
        new Date(a.datum_primjene).getTime()
    );

    return uniqueEntries;
  };

  /**
   * Calculates the color based on the comparison between the current and previous values.
   *
   * @param {string} currentValue - The current value to compare against the previous value.
   * @param {string | undefined} previousValue - The previous value to compare with the current value. If undefined, it defaults to comparing with a transparent state.
   * @returns {string} A color indicating the relationship between the current and previous values:
   *   - "transparent" if there is no previous value or if both values are invalid.
   *   - "yellow" if either value is invalid.
   *   - "green" if the current value is greater than the previous value (indicating an increase).
   *   - "red" if the current value is less than the previous value (indicating a decrease).
   */
  const calculateColor = (
    currentValue: string,
    previousValue: string | undefined
  ) => {
    if (!previousValue) return "transparent";

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
      return "red"; // Decrease
    } else {
      return "transparent"; // No change
    }
  };

  return (
    <div>
      <div className="history-filter">
        <input
          disabled={!!date}
          value={dateTo.toISOString().substring(0, 10)}
          type="date"
          onChange={(e) => setDateTo(new Date(e.target.value))}
        ></input>
        <select value={daysBefore} onChange={handleChange}>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            const dateFrom = date ? new Date(date!) : new Date();

            dateFrom.setDate(dateTo.getDate() - Number(daysBefore));

            fetchExchangeRateDifferences(
              dateFrom.toISOString().substring(0, 10),
              dateTo.toISOString().substring(0, 10)
            );
          }}
        >
          Povijest tečajnih razlika{" "}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Broj tečajnice</th>
            <th>Datum primjene </th>
            <th>Valuta</th>
            <th>Država</th>
            <th>ISO</th>
            <th>Kupovni za devize</th>
            <th>Srednji za devize</th>
            <th>Prodajni za devize</th>
            <th>Promjena</th>
          </tr>
        </thead>
        <tbody>
          {groupedByExchangeRateNumber(
            historyByDate!.filter((data) => data.valuta === currency)
          ).map((value, index) => {
            const prevValue =
              index > 0
                ? groupedByExchangeRateNumber(
                    historyByDate!.filter((data) => data.valuta === currency)
                  )[index - 1]
                : null;

            const cleanedCurrentValue = value?.kupovni_tecaj.replace(",", ".");
            const cleanedPreviousValue = prevValue?.kupovni_tecaj.replace(
              ",",
              "."
            );
            /**
             * Calculates the relative change between the current value (`cleanedCurrentValue`) and the previous value (`cleanedPreviousValue`)
             * based on the exchange rate (`prevValue.kupovni_tecaj`). The calculation is done by dividing the current value by the previous value,
             * subtracting 1, and then multiplying by 100 to get a percentage increase or decrease. The result is rounded to two decimal places.
             * If `prevValue.kupovni_tecaj` is not available, the function returns "N/A".
             *
             * @param {Object} prevValue - An object containing the previous value's details, including the exchange rate (`kupovni_tecaj`).
             * @param {number} cleanedCurrentValue - The cleaned-up current value, expected to be a numeric string or number.
             * @param {number} cleanedPreviousValue - The cleaned-up previous value, expected to be a numeric string or number.
             * @returns {string} The relative change as a percentage (e.g., "5.00") if the exchange rate is available, otherwise "N/A".
             */
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
                <td>{value.drzava_iso}</td>
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
                      prevValue?.prodajni_tecaj
                    ),
                  }}
                >
                  {value.prodajni_tecaj}
                </td>
                <td>{relativeChange}%</td>
              </tr>
            );
          })}
          {loading && (
            <tr>
              <td style={{ textAlign: "center" }} colSpan={9}>
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryByDate;
