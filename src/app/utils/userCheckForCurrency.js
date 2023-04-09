export function currencyIsOnlyOne(data) {
  let currencies = [];

  if (data) {
    for (let acc of data) {
      currencies.push(acc.currency);
    }
    currencies = [...new Set([...currencies])];
  }

  return currencies.length === 1 ? true : false;
}
