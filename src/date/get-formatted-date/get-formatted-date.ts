export const getFormattedDate = (d: Date, format = 'MM/DD/YYYY') => {
  const date = new Date(d.getTime() + d.getTimezoneOffset() * 60000);

  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  switch (format) {
    case 'MM/DD/YYYY':
      return month + '/' + day + '/' + year;
    default:
      return date;
  }
};

export default getFormattedDate;
