const formatAMPM = (startDate) => {
  let date = new Date(startDate);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let minutes2 = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes2 + " " + ampm;
  return strTime;
};

const dateFormatter = (date) => {
  let d = new Date(date);
  const dateTimeFormat = new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
  ] = dateTimeFormat.formatToParts(d);
  return `${month}/${day}/${year}`;
};

export { formatAMPM, dateFormatter };
