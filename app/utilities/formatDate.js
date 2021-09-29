export default formatDate = (date) => {
  let dateOfDate = new Date(date).getDate().toString();
  let monthOfDate = new Date(date).getMonth().toString();

  return dateOfDate + "/" + monthOfDate;
};
