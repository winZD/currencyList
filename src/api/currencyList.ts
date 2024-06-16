export const getCurrency = async () => {
  const res = fetch("https://api.hnb.hr/tecajn-eur/v3")
    .then((response) => response.json())
    .then((json) => json);

  return res;
};

export const getHistoryByCurrency = async (currency: string) => {
  const res = fetch(`https://api.hnb.hr/tecajn-eur/v3?valuta=${currency}`)
    .then((response) => response.json())
    .then((json) => json);

  return res;
};
export const getHistoryByDate = async (currency: string, date: string) => {
  const res = fetch(
    `https://api.hnb.hr/tecajn-eur/v3?valuta=${currency}&datum-primjene-od=${date}`
  )
    .then((response) => response.json())
    .then((json) => json);

  return res;
};

export const getExchangeRateDifferences = async (
  dateFrom: string,
  dateTo: string
) => {
  const res = fetch(
    `https://api.hnb.hr/tecajn-eur/v3?datum-primjene-od=${dateFrom}&datum-primjene-do=${dateTo}`
  )
    .then((response) => response.json())
    .then((json) => json);

  return res;
};
