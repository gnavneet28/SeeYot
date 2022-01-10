import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import asyncStorage from "./cache";
import DataConstants from "./DataConstants";

const authorizeContactsUpdate = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const TIME_LIMIT = 2;

  let contactsUpdate = await asyncStorage.get(DataConstants.CONTACTS_UPDATE);

  if (!contactsUpdate) {
    await asyncStorage.store(DataConstants.CONTACTS_UPDATE, []);
    return true;
  }

  if (
    contactsUpdate.filter(
      (c) => dayjs(currentDate).diff(c, "hours") < TIME_LIMIT
    ).length
  )
    return false;

  return true;
};

const authorizeEchoMessagesUpdate = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const TIME_LIMIT = 12;

  let echoMessagesUpdate = await asyncStorage.get(
    DataConstants.ECHO_MESSAGE_UPDATE
  );

  if (!echoMessagesUpdate) {
    await asyncStorage.store(DataConstants.ECHO_MESSAGE_UPDATE, []);
    return true;
  }

  if (
    echoMessagesUpdate.filter(
      (c) => dayjs(currentDate).diff(c, "hours") < TIME_LIMIT
    ).length
  )
    return false;

  return true;
};

const authorizeFavoritesUpdate = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const TIME_LIMIT = 12;

  let favoritesUpdate = await asyncStorage.get(DataConstants.FAVORITES_UPDATE);

  if (!favoritesUpdate) {
    await asyncStorage.store(DataConstants.FAVORITES_UPDATE, []);
    return true;
  }

  if (
    favoritesUpdate.filter(
      (c) => dayjs(currentDate).diff(c, "hours") < TIME_LIMIT
    ).length
  )
    return false;

  return true;
};

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

const authorizeReadMessagesUpdate = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const TIME_LIMIT = 24;

  let messagesUpdate = await asyncStorage.get(DataConstants.MESSAGES_UPDATE);

  if (!messagesUpdate) {
    await asyncStorage.store(DataConstants.MESSAGES_UPDATE, []);
    return true;
  }
  if (
    messagesUpdate.filter(
      (c) => dayjs(currentDate).diff(c, "hours") < TIME_LIMIT
    ).length
  )
    return false;

  return true;
};

const authorizePhoneContactsUpdate = async () => {
  let currentDate = Date.now();
  dayjs.extend(relativeTime);

  const TIME_LIMIT = 12;

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
  )
    return false;

  return true;
};

const updateContactsUpdate = async () => {
  let newContactsUpdate = [];
  newContactsUpdate.push(new Date());

  return await asyncStorage.store(
    DataConstants.CONTACTS_UPDATE,
    newContactsUpdate
  );
};

const updateFavoritesUpdate = async () => {
  let newFavoritesUpdate = [];
  newFavoritesUpdate.push(new Date());

  return await asyncStorage.store(
    DataConstants.FAVORITES_UPDATE,
    newFavoritesUpdate
  );
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

const updateReadMessagesUpdate = async () => {
  let newMessagesUpdate = [];
  newMessagesUpdate.push(new Date());

  return await asyncStorage.store(
    DataConstants.MESSAGES_UPDATE,
    newMessagesUpdate
  );
};
const updateEchoMessagesUpdate = async () => {
  let newEchoMessagesUpdate = [];
  newEchoMessagesUpdate.push(new Date());

  return await asyncStorage.store(
    DataConstants.ECHO_MESSAGE_UPDATE,
    newEchoMessagesUpdate
  );
};

export default {
  authorizeEchoMessagesUpdate,
  authorizeContactsUpdate,
  authorizeExpiredUpdate,
  authorizeFavoritesUpdate,
  authorizePhoneContactsUpdate,
  authorizeReadMessagesUpdate,
  updateContactsUpdate,
  updateExpiredUpdate,
  updateFavoritesUpdate,
  updatePhoneContactsUpdate,
  updateReadMessagesUpdate,
  updateEchoMessagesUpdate,
};
