import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import asyncStorage from "./cache";
import DataConstants from "./DataConstants";

const currentAdsStats = async () => {
  const adsStats = await asyncStorage.get(DataConstants.ADSSTATS);
  return adsStats;
};

const authorizeAds = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const DAY_LIMIT = 15;
  const TIME_LIMIT = 2;
  const ADS_NUMBER_LIMIT = 8;

  const { joinedAt, numberOfAdsSeen } = await currentAdsStats();

  //if (dayjs(currentDate).diff(joinedAt, "days") < DAY_LIMIT) return false;

  if (!numberOfAdsSeen.length) return true;

  if (
    dayjs(currentDate).diff(
      numberOfAdsSeen[numberOfAdsSeen.length - 1],
      "minutes"
    ) < TIME_LIMIT
  )
    return false;

  if (
    numberOfAdsSeen.filter((a) => dayjs(currentDate).diff(a, "hours") < 24)
      .length >= ADS_NUMBER_LIMIT
  )
    return false;

  return true;
};

const showAdsSeenInLastTwoMinutes = async () => {
  let currentDate = new Date();
  const adsStats = await asyncStorage.get(DataConstants.ADSSTATS);
  return adsStats.numberOfAdsSeen.filter(
    (a) => dayjs(currentDate).diff(a, "minutes") < 2
  ).length;
};

const showAdsSeenInLastTwentyFourHours = async () => {
  let currentDate = new Date();
  const adsStats = await asyncStorage.get(DataConstants.ADSSTATS);
  return adsStats.numberOfAdsSeen.filter(
    (a) => dayjs(currentDate).diff(a, "hours") < 24
  ).length;
};

const showAccountDays = (user) => {
  let currentDate = new Date();
  return dayjs(currentDate).diff(user.joinedAt, "days");
};

export default authorizeAds;

export {
  showAdsSeenInLastTwoMinutes,
  showAdsSeenInLastTwentyFourHours,
  showAccountDays,
};
