import faker from "faker";

let users = [
  { _id: "jhfgvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgnvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhmfgvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfjgvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfbkjbgvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfbmbnbmgvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgmmnvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfvnbngvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfnngvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "khk", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgmbhhvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "bbbb", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgvjnkjhkjaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfghbjhvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgmbbvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfgmnbjbjhbjvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "jhfgjbgbjbjvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgjbjhbjhvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfgjbjkkjjkvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "jhfghbjhbjbvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgvbkjbkjkaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgvjjhbbaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgbhbbbvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfggfchgvjhvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "jhfgbjbkjvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgbjhbvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfggxgfxgfxgfvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  {
    _id: "jhfgjhgjghbjbjvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  {
    _id: "jhfgbjbjkjkjvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "jhfghbjhbbvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfghvhjhvhvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfghvjhvjhvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgfgcgfcvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgfgchchgvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfjyuyggvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "j", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "h", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jhfgjkhkhkuvaj", name: "Gaurav", phoneNumber: 94353331, picture: "" },

  {
    _id: "jhfghbjxvjzbdxjdbhbbvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "jhjjhj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "hjh", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jjgj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfgfgchjhgjgjgjhchgvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  {
    _id: "jhfjkjkjhkjyuyggvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "jkgkjhkjh", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "hopiopoiuyf", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfghydyygjkhkhkuvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },

  {
    _id: "jhfghbjvjvmnxvjzbdxjdbhbbvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "jhjmbmnbmnjhj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "hmbmnbmjh", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  { _id: "jjmbmbbjkgj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfgfghjhhjjkkjchjhgjgjgjhchgvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  {
    _id: "jhfjkhjgujjkjhkjyuyggvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  {
    _id: "jkgmbmbhhjnjkjhkjh",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
  { _id: "nvgvvhjjbj", name: "Gaurav", phoneNumber: 94353331, picture: "" },
  {
    _id: "jhfgfyggjjhydyygjkhkhkuvaj",
    name: "Gaurav",
    phoneNumber: 94353331,
    picture: "",
  },
];

// for (let i = 0; i < 5; i++) {
//   let user = {
//     _id: faker.unique(),
//     name: faker.name.findName(),
//     picture: faker.image.imageUrl(100, 100, "animals", true, true),
//     phoneNumber: faker.phone.phoneNumber(),
//   };

//   users.push(user);
// }

export default {
  users,
};
