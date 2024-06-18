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
              <th onClick={() => toggleSort("brojTecajnice")}>
                Broj tečajnice{" "}
                <img
                  height={25}
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
              <th onClick={() => toggleSort("datumPrimjene")}>
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

              <th onClick={() => toggleSort("valuta")}>
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
              <th onClick={() => toggleSort("drzava")}>
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
              <th onClick={() => toggleSort("sifraValute")}>
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

              <th onClick={() => toggleSort("kupovniTecaj")}>
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
              <th onClick={() => toggleSort("srednjiTecaj")}>
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
              <th onClick={() => toggleSort("prodajniTecaj")}>
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
