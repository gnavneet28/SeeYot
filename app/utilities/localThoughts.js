import asyncStorage from "./cache";
import DataConstants from "./DataConstants";

const storeLoacalThoughts = async (thought, recipient, key) => {
  let localThoughts = await asyncStorage.get(
    DataConstants.LOCAL_SAVED_THOUGHTS
  );
  if (!localThoughts) {
    localThoughts = [];
    let modifiedThought = { ...thought };
    modifiedThought.sentTo = recipient.name;
    modifiedThought.key = key ? key : "";
    localThoughts.push(modifiedThought);
    return await asyncStorage.store(
      DataConstants.LOCAL_SAVED_THOUGHTS,
      localThoughts
    );
  }

  let modifiedThought = { ...thought };
  modifiedThought.key = key ? key : "";
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

  return [];
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

const deleteMatchedThoughts = async (thoughts) => {
  let initialThoughts = await asyncStorage.get(
    DataConstants.LOCAL_SAVED_THOUGHTS
  );

  if (initialThoughts) {
    let newLocalThoughtsList = [];

    for (let thought of initialThoughts) {
      if (thoughts.filter((t) => t._id == thought._id).length < 1) {
        newLocalThoughtsList.push(thought);
      }
    }

    return await asyncStorage.store(
      DataConstants.LOCAL_SAVED_THOUGHTS,
      newLocalThoughtsList
    );
  }
  return;
};

export default {
  deleteThought,
  getLocalThoughts,
  storeLoacalThoughts,
  deleteMatchedThoughts,
};
