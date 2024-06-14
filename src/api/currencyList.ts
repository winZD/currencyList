const getCurrency = async () => {
  const res = fetch("https://api.hnb.hr/tecajn/v2")
    .then((response) => response.json())
    .then((json) => json);

  return res;
};

export default getCurrency;
