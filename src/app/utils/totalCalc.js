export function totalCalc(data) {
  let currencies = [];
  let result = [];

  if (data) {
    for (let acc of data) {
      currencies.push(acc.currency);
    }
    currencies = new Set([...currencies]);

    for (let cur of currencies) {
      result.push([
        data
          .filter((acc) => acc.currency === cur)
          .reduce((accum, currentValue) => accum + currentValue.amount, 0)
          ?.toFixed(2),
        cur
      ]);
    }
  }

  return result;
}
