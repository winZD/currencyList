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
        item.broj_tecajnice
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        item.datum_primjene
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        item.drzava.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.drzava_iso.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.sifra_valute.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.kupovni_tecaj
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        item.srednji_tecaj
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        item.prodajni_tecaj
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    );

    return filteredData;
  };
  const sortData = (data: Currency[]): Currency[] => {
    const d = data;
    if (sortField === "drzava") {
      return order === "asc"
        ? d.sort((a, b) => {
            return a.drzava.toLowerCase().localeCompare(b.drzava);
          })
        : d.sort((a, b) => {
            return b.drzava.toLowerCase().localeCompare(a.drzava);
          });
    }
    if (sortField === "valuta") {
      return order === "asc"
        ? d.sort((a, b) => {
            return a.valuta.toLowerCase().localeCompare(b.valuta);
          })
        : d.sort((a, b) => {
            return b.valuta.toLowerCase().localeCompare(a.valuta);
          });
    }
    if (sortField === "sifraValute") {
      return order === "asc"
        ? d.sort((a, b) => {
            return Number(a.sifra_valute) - Number(b.sifra_valute);
          })
        : d.sort((a, b) => {
            return Number(b.sifra_valute) - Number(a.sifra_valute);
          });
    }
    if (sortField === "kupovniTecaj") {
      return order === "asc"
        ? d.sort((a, b) => {
            return (
              Number(a.kupovni_tecaj.replace(",", ".")) -
              Number(b.kupovni_tecaj.replace(",", "."))
            );
          })
        : d.sort((a, b) => {
            return (
              Number(b.kupovni_tecaj.replace(",", ".")) -
              Number(a.kupovni_tecaj.replace(",", "."))
            );
          });
    }
    if (sortField === "srednjiTecaj") {
      return order === "asc"
        ? d.sort((a, b) => {
            return (
              Number(a.srednji_tecaj.replace(",", ".")) -
              Number(b.srednji_tecaj.replace(",", "."))
            );
          })
        : d.sort((a, b) => {
            return (
              Number(b.srednji_tecaj.replace(",", ".")) -
              Number(a.srednji_tecaj.replace(",", "."))
            );
          });
    }
    if (sortField === "prodajniTecaj") {
      return order === "asc"
        ? d.sort((a, b) => {
            return (
              Number(a.prodajni_tecaj.replace(",", ".")) -
              Number(b.prodajni_tecaj.replace(",", "."))
            );
          })
        : d.sort((a, b) => {
            return (
              Number(b.prodajni_tecaj.replace(",", ".")) -
              Number(a.prodajni_tecaj.replace(",", "."))
            );
          });
    }
    return d;
  };

  useEffect(() => {
    getCurrency().then((data) => {
      setCurrencies(data);
    });
  }, []);
  return (
    <>
      <div style={{ width: "100%" }}>
        <div className="filter-wrapper">
          <div className="filter">
            <div className="input-container">
              <input
                type="text"
                placeholder="Pretraži"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button
              onClick={() =>
                setDate(new Date(date.setDate(date.getDate() - 1)))
              }
            >
              Prev
            </button>
            {/*  <span>{date.toISOString().substring(0, 10)}</span> */}
            <div className="input-container">
              <input
                value={date.toISOString().substring(0, 10)}
                type="date"
                onChange={(e) => setDate(new Date(e.target.value))}
              ></input>
            </div>{" "}
            <button
              onClick={() =>
                setDate(new Date(date.setDate(date.getDate() + 1)))
              }
            >
              Next
            </button>
          </div>
          <Link
            to={`/povijest/${"USD"}/${date.toISOString().substring(0, 10)}`}
          >
            <button onClick={() => {}}>Povijest</button>
          </Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>Broj tečajnice</th>
              <th>Datum primjene </th>

              <th onClick={() => toggleSort("valuta")}>
                {sortField === "valuta" ? (order === "asc" ? "▲" : "▼") : "---"}
              </th>
              <th onClick={() => toggleSort("drzava")}>
                {sortField === "drzava" ? (order === "asc" ? "▲" : "▼") : "---"}
                <img src="/vite.svg"></img>
              </th>
              <th onClick={() => toggleSort("sifraValute")}>
                {sortField === "sifraValute"
                  ? order === "asc"
                    ? "▲"
                    : "▼"
                  : "---"}
              </th>

              <th onClick={() => toggleSort("kupovniTecaj")}>
                {sortField === "kupovniTecaj"
                  ? order === "asc"
                    ? "▲"
                    : "▼"
                  : "---"}
              </th>
              <th onClick={() => toggleSort("srednjiTecaj")}>
                {sortField === "srednjiTecaj"
                  ? order === "asc"
                    ? "▲"
                    : "▼"
                  : "---"}
              </th>
              <th onClick={() => toggleSort("prodajniTecaj")}>
                {sortField === "prodajniTecaj"
                  ? order === "asc"
                    ? "▲"
                    : "▼"
                  : "---"}
              </th>
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
                  <td>{value.sifra_valute}</td>
                  <td>{value.kupovni_tecaj}</td>
                  <td>{value.srednji_tecaj}</td>
                  <td>{value.prodajni_tecaj}</td>
                </tr>
              );
            })}
            {!handleSearch(sortData(currencies)).length && (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={8}>
                  Nema rezultata pretrage!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CurrencyList;
