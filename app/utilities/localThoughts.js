import asyncStorage from "./cache";
import DataConstants from "./DataConstants";

const storeLoacalThoughts = async (thought, recipient) => {
  let localThoughts = await asyncStorage.get(
    DataConstants.LOCAL_SAVED_THOUGHTS
  );
  if (!localThoughts) {
    localThoughts = [];
    let modifiedThought = { ...thought };
    modifiedThought.sentTo = recipient.name;
    localThoughts.push(modifiedThought);
    return await asyncStorage.store(
      DataConstants.LOCAL_SAVED_THOUGHTS,
      localThoughts
    );
  }

  if (await checkIfMessageAlreadyExist(thought)) return;
  let modifiedThought = { ...thought };
  modifiedThought.sentTo = recipient.name;
  localThoughts.push(modifiedThought);
  return await asyncStorage.store(
    DataConstants.LOCAL_SAVED_THOUGHTS,
    localThoughts
  );
};

const getLocalThoughts = async () => {
  let localThoughts = await asyncStorage.get(
    DataConstants.LOCAL_SAVED_THOUGHTS
  );

  if (localThoughts) return localThoughts;

  return null;
};

const deleteThought = async (thought) => {
  let localThoughts = await asyncStorage.get(
    DataConstants.LOCAL_SAVED_THOUGHTS
  );

  if (localThoughts) {
    let newLocalThoughts = localThoughts.filter((t) => t._id != thought._id);
    return await asyncStorage.store(
      DataConstants.LOCAL_SAVED_THOUGHTS,
      newLocalThoughts
    );
  }
  return;
};

const checkIfMessageAlreadyExist = async (data) => {
  let initialThoughts = await asyncStorage.get(
    DataConstants.LOCAL_SAVED_THOUGHTS
  );

  for (let thought of initialThoughts) {
    if (thought.message == data.message) return true;
  }

  return false;
};

export default {
  deleteThought,
  getLocalThoughts,
  storeLoacalThoughts,
};
