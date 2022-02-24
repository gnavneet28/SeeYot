export default formatDate = (date) => {
  let actualDate = new Date(date);
  let dateOfDate = actualDate.getDate().toString();
  let monthOfDate = (actualDate.getMonth() + 1).toString();
  let yearOfDate = actualDate.getFullYear().toString();

  return dateOfDate + "/" + monthOfDate + "/" + yearOfDate;
};
