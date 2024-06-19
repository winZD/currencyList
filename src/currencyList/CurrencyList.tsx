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
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setOrder("asc");
    }
  };

  /**
   * Filters an array of currency objects based on a search value.
   *
   * This function searches through an array of currency objects and returns a new array that includes only those currencies whose country name (`drzava`), ISO country code (`drzava_iso`), currency code (`sifra_valute`), or currency symbol (`valuta`) matches the search value, ignoring case.
   *
   * @param {Currency[]} data - The original array of currency objects to filter.
   * @returns {Currency[]} A new array containing only the currency objects that match the search criteria.
   */
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

  /**
   * Sorts an array of currency objects based on different fields and orders.
   *
   * @param {Currency[]} data - The array of currency objects to be sorted.
   * @returns {Currency[]} Sorted array of currency objects.
   */
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}.${month}.${year}.`;
  };
  useEffect(() => {
    setLoading(true);
    getCurrency().then((data) => {
      setCurrencies(data);
      setLoading(false);
    });
  }, []);
  return (
    <>
      <div style={{ width: "100%" }}>
        <div className="filter-wrapper">
          <div className="filter">
            <div style={{ marginRight: 15 }}>
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
            <div>
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
        <span>Broj tečajnice: {currencies[0]?.broj_tecajnice}</span>
        <br />
        <span>Datum primjene: {formatDate(currencies[0]?.datum_primjene)}</span>

        <table>
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("valuta")}
              >
                Valuta
                <img
                  height={25}
                  src={
                    sortField === "valuta"
                      ? order === "asc"
                        ? "./sort-asc.png"
                        : "./sort-desc.png"
                      : "./sort.png"
                  }
                  alt="sorting"
                />
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("drzava")}
              >
                Država
                <img
                  height={25}
                  src={
                    sortField === "drzava"
                      ? order === "asc"
                        ? "./sort-asc.png"
                        : "./sort-desc.png"
                      : "./sort.png"
                  }
                  alt="sorting"
                />
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("sifraValute")}
              >
                Šifra valute
                <img
                  height={25}
                  src={
                    sortField === "sifraValute"
                      ? order === "asc"
                        ? "./sort-asc.png"
                        : "./sort-desc.png"
                      : "./sort.png"
                  }
                  alt="sorting"
                />
              </th>

              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("kupovniTecaj")}
              >
                Kupovni tečaj
                <img
                  height={25}
                  src={
                    sortField === "kupovniTecaj"
                      ? order === "asc"
                        ? "./sort-asc.png"
                        : "./sort-desc.png"
                      : "./sort.png"
                  }
                  alt="sorting"
                />
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("srednjiTecaj")}
              >
                Srednji tečaj
                <img
                  height={25}
                  src={
                    sortField === "srednjiTecaj"
                      ? order === "asc"
                        ? "./sort-asc.png"
                        : "./sort-desc.png"
                      : "./sort.png"
                  }
                  alt="sorting"
                />
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("prodajniTecaj")}
              >
                Prodajni tečaj
                <img
                  height={25}
                  src={
                    sortField === "prodajniTecaj"
                      ? order === "asc"
                        ? "./sort-asc.png"
                        : "./sort-desc.png"
                      : "./sort.png"
                  }
                  alt="sorting"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {handleSearch(sortData(currencies)).map((value, key) => {
              return (
                <tr key={key}>
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
            {searchValue.length &&
            !handleSearch(sortData(currencies)).length ? (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={6}>
                  Nema rezultata pretrage!
                </td>
              </tr>
            ) : null}
            {loading && (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={6}>
                  Loading...
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
