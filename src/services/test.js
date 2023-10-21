async function test() {
  const coins = [
    "USD-EUR",
    "USD-JPY",
    "USD-GBP",
    "USD-AUD",
    "USD-CAD",
    "USD-CHF",
    "USD-NZD",
    "EUR-USD",
    "EUR-JPY",
    "EUR-GBP",
    "EUR-AUD",
    "EUR-CAD",
    "EUR-CHF",
    "EUR-NZD",
    "JPY-USD",
    "JPY-EUR",
    "JPY-GBP",
    "JPY-AUD",
    "JPY-CAD",
    "JPY-CHF",
    "JPY-NZD",
    "GBP-USD",
    "GBP-EUR",
    "GBP-JPY",
    "GBP-AUD",
    "GBP-CAD",
    "GBP-CHF",
    "GBP-NZD",
    "AUD-USD",
    "AUD-EUR",
    "AUD-JPY",
    "AUD-GBP",
    "AUD-CAD",
    "AUD-CHF",
    "AUD-NZD",
    "AUD-CAD",
    "AUD-CHF",
    "AUD-JPY",
    "AUD-NZD",
    "AUD-USD",
    "CAD-CHF",
    "CAD-JPY",
    "CHF-JPY",
    "EUR-AUD",
    "EUR-CAD",
    "EUR-CHF",
    "EUR-GBP",
    "EUR-JPY",
    "EUR-NZD",
    "EUR-USD",
    "GBP-AUD",
    "GBP-CAD",
    "GBP-CHF",
    "GBP-JPY",
    "GBP-NZD",
    "GBP-USD",
    "NZD-CAD",
    "NZD-CHF",
    "NZD-JPY",
    "NZD-USD",
    "USD-CAD",
    "USD-CHF",
    "USD-JPY",
  ];
  let results = [];

  for (let coin = 0; coin < coins.length; coin++) {
    const result = await fetch(
      `https://economia.awesomeapi.com.br/json/daily/${coins[coin]}/100`
    ).then((res) => res.json());

    const data = result;

    let red = 0;
    let green = 0;
    let last10 = [];
    let inicio = "";
    let fim = "";

    for (let i = 0; i < result.length; i++) {
      if (data[i] && data[i - 1]) {
        const type =
          Number(data[i].bid - data[i - 1].bid) > 0
            ? "green"
            : Number(data[i].bid - data[i - 1].bid) < 0
            ? "red"
            : "none";

        if (i < 11) last10.push(type);

        if (i === 0) {
          fim = new Date(data[i].timestamp * 1000);
        }
        if (result.length === i + 1) {
          inicio = new Date(data[i].timestamp * 1000);
        }

        if (type === "green") green++;
        else if (type === "red") red++;
      }
    }
    console.log(coins[coin]);

    results.push({
      coin: coins[coin],
      green,
      red,
      last10,
      fim,
      inicio,
    });
  }

  for (const val of results) {
    if (val.red > 60 || val.green > 60) console.log(val);
  }
}

module.exports = { test };
