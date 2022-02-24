// export default filterThoughts = (thoughts = [], recipient, creator) => {
//   return thoughts
//     .filter(
//       (t) =>
//         (t.messageFor == recipient._id && t.createdBy == creator._id) ||
//         (t.messageFor == creator._id && t.createdBy == recipient._id)
//     )
//     .sort((a, b) => a.createdAt < b.createdAt);
// };

const filterThoughts = (thoughts = [], recipient, creator) => {
  return thoughts
    .filter(
      (t) =>
        (t.messageFor == recipient._id && t.createdBy == creator._id) ||
        (t.messageFor == creator._id && t.createdBy == recipient._id)
    )
    .sort((a, b) => a.createdAt > b.createdAt);
};

const filterActiveMessages = (messages = [], recipient, creator) => {
  return messages.filter(
    (m) =>
      (m.createdFor == recipient._id && m.createdBy == creator._id) ||
      (m.createdFor == creator._id && m.createdBy == recipient._id)
  );
};

export default {
  filterActiveMessages,
  filterThoughts,
};
