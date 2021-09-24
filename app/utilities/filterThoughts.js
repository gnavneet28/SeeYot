export default filterThoughts = (thoughts = [], recipient, creator) => {
  return thoughts
    .filter(
      (t) =>
        (t.messageFor == recipient._id && t.createdBy == creator._id) ||
        (t.messageFor == creator._id && t.createdBy == recipient._id)
    )
    .sort((a, b) => a.createdAt < b.createdAt);
};
