import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import asyncStorage from "./cache";
import DataConstants from "./DataConstants";

const authorizeExpiredUpdate = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const TIME_LIMIT = 12;

  let expiredUpdate = await asyncStorage.get(DataConstants.EXPIRED_UPDATE);

  if (!expiredUpdate) {
    await asyncStorage.store(DataConstants.EXPIRED_UPDATE, []);
    return true;
  }

  if (
    expiredUpdate.filter(
      (c) => dayjs(currentDate).diff(c, "hours") < TIME_LIMIT
    ).length
  )
    return false;
  return true;
};

const authorizePhoneContactsUpdate = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const TIME_LIMIT = 24;

  let phoneContactsUpdate = await asyncStorage.get(
    DataConstants.PHONE_CONTACTS_UPDATE
  );

  if (!phoneContactsUpdate) {
    await asyncStorage.store(DataConstants.PHONE_CONTACTS_UPDATE, []);
    return true;
  }

  if (
    phoneContactsUpdate.filter(
      (c) => dayjs(currentDate).diff(c, "hours") < TIME_LIMIT
    ).length
  ) {
    return false;
  }

  return true;
};

const updateExpiredUpdate = async () => {
  let newExpiredUpdate = [];
  newExpiredUpdate.push(new Date());

  return await asyncStorage.store(
    DataConstants.EXPIRED_UPDATE,
    newExpiredUpdate
  );
};

const updatePhoneContactsUpdate = async () => {
  let newPhoneContactsUpdate = [];
  newPhoneContactsUpdate.push(new Date());

  return await asyncStorage.store(
    DataConstants.PHONE_CONTACTS_UPDATE,
    newPhoneContactsUpdate
  );
};

export default {
  authorizeExpiredUpdate,
  authorizePhoneContactsUpdate,
  updateExpiredUpdate,
  updatePhoneContactsUpdate,
};
