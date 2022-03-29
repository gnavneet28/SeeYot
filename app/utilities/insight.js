import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getNumberOfPeopleInContacts = (
  totalData = [],
  duration = "All",
  user
) => {
  if (!totalData.length) return 0;
  let currentDate = new Date();
  let numberOfPeopleInContacts = 0;
  let dataToConsider;

  if (duration == "All") {
    dataToConsider = totalData;
  } else if (duration == "Week") {
    dataToConsider = totalData.filter(
      (d) => dayjs(currentDate).diff(d.timeStamp, "days") < 8
    );
  } else if (duration == "Month") {
    dataToConsider = totalData.filter(
      (d) => dayjs(currentDate).diff(d.timeStamp, "days") < 29
    );
  }

  for (let data of dataToConsider) {
    if (user.contacts.filter((u) => u._id == data.statsId).length) {
      numberOfPeopleInContacts = numberOfPeopleInContacts + 1;
    }
  }

  let others = dataToConsider.length - numberOfPeopleInContacts;

  return { numberOfPeopleInContacts, others };
};

const getNumberOfPeopleInFavorites = (
  totalData = [],
  duration = "All",
  user
) => {
  if (!totalData.length) return 0;
  let currentDate = new Date();
  let numberOfPeopleInFavorites = 0;

  let dataToConsider;

  if (duration == "All") {
    dataToConsider = totalData;
  } else if (duration == "Week") {
    dataToConsider = totalData.filter(
      (d) => dayjs(currentDate).diff(d.timeStamp, "days") < 8
    );
  } else if (duration == "Month") {
    dataToConsider = totalData.filter(
      (d) => dayjs(currentDate).diff(d.timeStamp, "days") < 29
    );
  }

  for (let data of dataToConsider) {
    if (user.favorites.filter((u) => u._id == data.statsId).length) {
      numberOfPeopleInFavorites = numberOfPeopleInFavorites + 1;
    }
  }

  let others = dataToConsider.length - numberOfPeopleInFavorites;

  return { numberOfPeopleInFavorites, others };
};

export default {
  getNumberOfPeopleInContacts,
  getNumberOfPeopleInFavorites,
};
