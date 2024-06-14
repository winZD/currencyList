export const getCurrency = async () => {
  const res = fetch("https://api.hnb.hr/tecajn/v2")
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
