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
   * Filters an array of currency objects based on a search value. The search can match against various properties of the currency objects,
   * including identifiers like `broj_tecajnice`, dates like `datum_primjene`, country names like `drzava` and `drzava_iso`,
   * currency codes like `sifra_valute`, and exchange rates like `kupovni_tecaj`, `srednji_tecaj`, and `prodajni_tecaj`.
   *
   * The search is case-insensitive and checks if the search value is included anywhere within the property values.
   *
   * @param {Currency[]} data - An array of currency objects to filter. Each object should have properties matching those checked during filtering.
   * @returns {Currency[]} A new array containing only the items from `data` that match the search criteria.
   *
   * @example
   * // Example usage:
   * const currencies = [
   *   { broj_tecajnice: '123', datum_primjene: '2024-01-01', drzava: 'USA', drzava_iso: 'US', sifra_valute: 'USD', kupovni_tecaj: 1.23 },
   *   { broj_tecajnice: '456', datum_primjene: '2024-02-01', drzava: 'Germany', drzava_iso: 'DE', sifra_valute: 'EUR', kupovni_tecaj: 1.45 }
   * ];
   * const searchValue = 'usa';
   * const filteredCurrencies = handleSearch(currencies);
   * console.log(filteredCurrencies); // Output will include the currency object(s) where 'USA' matches the search value.
   */
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

  /**
   * Sorts an array of currency objects (`data`) based on a specified field (`sortField`) and order (`order`). The sorting can be performed
   * in ascending (`asc`) or descending (`desc`) order. The supported fields for sorting include `brojTecajnice`, `datumPrimjene`, `drzava`,
   * `valuta`, `sifraValute`, `kupovniTecaj`, `srednjiTecaj`, and `prodajniTecaj`. Each field has a specific sorting logic:
   * - Numeric fields (`brojTecajnice`, `sifraValute`, `kupovniTecaj`, `srednjiTecaj`, `prodajniTecaj`) are sorted numerically after converting commas to dots.
   * - Date fields (`datumPrimjene`) are sorted based on their timestamp.
   * - String fields (`drzava`, `valuta`) are sorted alphabetically using locale comparison.
   *
   * @param {Currency[]} data - An array of currency objects to sort. Each object should have properties matching those checked during sorting.
   * @param {string} sortField - The name of the field to sort by. Must be one of the following: `"brojTecajnice"`, `"datumPrimjene"`, `"drzava"`, `"valuta"`, `"sifraValute"`, `"kupovniTecaj"`, `"srednjiTecaj"`, `"prodajniTecaj"`.
   * @param {string} order - The sorting order. Can be either `"asc"` for ascending order or `"desc"` for descending order.
   * @returns {Currency[]} A new array containing the sorted currency objects.
   *
   * @example
   * // Example usage:
   * const currencies = [
   *   { broj_tecajnice: '123', datum_primjene: '2024-01-01', drzava: 'USA', valuta: 'USD', sifra_valute: '123', kupovni_tecaj: 1.23, srednji_tecaj: 1.25, prodajni_tecaj: 1.27 },
   *   { broj_tecajnice: '456', datum_primjene: '2024-02-01', drzava: 'Germany', valuta: 'EUR', sifra_valute: '456', kupovni_tecaj: 1.45, srednji_tecaj: 1.47, prodajni_tecaj: 1.49 }
   * ];
   * const sortField = 'kupovniTecaj';
   * const order = 'asc';
   * const sortedCurrencies = sortData(currencies, sortField, order);
   * console.log(sortedCurrencies); // Sorted array based on 'kupovniTecaj' in ascending order.
   */
  const sortData = (data: Currency[]): Currency[] => {
    const d = data;
    if (sortField === "brojTecajnice") {
      return order === "asc"
        ? d.sort((a, b) => {
            return (
              Number(a.broj_tecajnice.replace(",", ".")) -
              Number(b.broj_tecajnice.replace(",", "."))
            );
          })
        : d.sort((a, b) => {
            return (
              Number(b.broj_tecajnice.replace(",", ".")) -
              Number(a.broj_tecajnice.replace(",", "."))
            );
          });
    }
    if (sortField === "datumPrimjene") {
      return order === "asc"
        ? d.sort(
            (a, b) =>
              new Date(a.datum_primjene).getTime() -
              new Date(b.datum_primjene).getTime()
          )
        : d.sort(
            (a, b) =>
              new Date(b.datum_primjene).getTime() -
              new Date(a.datum_primjene).getTime()
          );
    }
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
        <span>Datum primjene: {currencies[0]?.datum_primjene}</span>

        <table>
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("brojTecajnice")}
              >
                Broj tečajnice{" "}
                <img
                  src={
                    sortField === "brojTecajnice"
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
                onClick={() => toggleSort("datumPrimjene")}
              >
                Datum primjene{" "}
                <img
                  height={25}
                  src={
                    sortField === "datumPrimjene"
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
            {searchValue.length &&
            !handleSearch(sortData(currencies)).length ? (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={8}>
                  Nema rezultata pretrage!
                </td>
              </tr>
            ) : null}
            {loading && (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={8}>
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
