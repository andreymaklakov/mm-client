export function todayDate() {
  const dateNow = new Date();
  const dateStr = `${dateNow.getFullYear()}-${
    String(dateNow.getMonth() + 1).length === 1
      ? "0" + (dateNow.getMonth() + 1)
      : dateNow.getMonth() + 1
  }-${
    String(dateNow.getDate()).length === 1
      ? "0" + dateNow.getDate()
      : dateNow.getDate()
  }`;

  return dateStr;
}

export function toDateFormat(date) {
  date = date.split("-");

  date = date.join(",");

  return date;
}

export function toInputFormat(date) {
  date = date.split(",");
  date = date.join("-");

  return date;
}

export function getStartOfMonth() {
  const dateNow = new Date();
  const dateStr = `${dateNow.getFullYear()},${dateNow.getMonth() + 1}`;
  const difference = Date.now() - new Date(dateStr);

  return difference;
}

export function toUsersReadableDateFormat(date) {
  date = date.split("-");
  date = [date[2], date[1], date[0]];
  date = date.join(".");

  return date;
}
