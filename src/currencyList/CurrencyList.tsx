import { useEffect, useState } from "react";
import { Currency } from "../api/models/currency";
import { getCurrency } from "../api/currencyList";
import { Link, useNavigate } from "react-router-dom";
import "./currencyList.css";

function CurrencyList() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [date, setDate] = useState(new Date());
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("none");
  const navigate = useNavigate();

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setOrder("asc");
    }
  };
  console.log(order);
  const handleSearch = (data: Currency[]): Currency[] => {
    if (!searchValue) return data;

    const filteredData = data.filter(
      (item) =>
        item.drzava.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.drzava_iso.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.sifra_valute.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.valuta.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredData;
  };
  const sortData = (data: Currency[]): Currency[] => {
    const d = data;
    if (sortField === "drzava") {
      return order === "asc"
        ? d.sort((a, b) => {
            return a.drzava.localeCompare(b.drzava);
          })
        : d.sort((a, b) => {
            return b.drzava.localeCompare(a.drzava);
          });
    }
    return d;
  };

  /*  const handleSorting = (sortField: string, sortOrder) => {
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };
 */
  useEffect(() => {
    getCurrency().then((data) => {
      setCurrencies(data);
    });
  }, []);
  return (
    <>
      <div className="input-container">
        <input
          type="text"
          placeholder="Pretraga"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="input-container">
        <input
          value={date.toISOString().substring(0, 10)}
          type="date"
          onChange={(e) => setDate(new Date(e.target.value))}
        ></input>
      </div>{" "}
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
        <button onClick={() => {}}>Povijest</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Broj tečajnice</th>
            <th>Datum primjene </th>

            <th></th>
            <th onClick={() => toggleSort("drzava")}>
              {sortField === "drzava" && (order === "asc" ? "▲" : "▼")}
            </th>
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
          {handleSearch(sortData(currencies)).map((value, key) => {
            return (
              <tr key={key}>
                <td>{value.broj_tecajnice}</td>
                <td>{value.datum_primjene}</td>
                <td
                  onClick={() =>
                    navigate(
                      `/povijest/${value.valuta}/${date
                        .toISOString()
                        .substring(0, 10)}`,
                      { state: { prev: "/tecaj" } }
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  {value.valuta}
                </td>
                <td>{value.drzava}</td>
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
