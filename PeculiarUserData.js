function randomPhoneno() {
  let min = 10000;
  let max = 90000;
  let num = Math.floor(Math.random() * min) + max;
  return num;
}
let arr = [];
for (let i = 0; i < 20; i++) {
  let phoneNo = randomPhoneno();
  if (!arr.includes(phoneNo)) {
    arr.push(phoneNo);
  }
}

const usersData = [
  {
    _id: "",
    message: "Hi there",
    name: "Tom",
    picture:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.producthunt.com%2Fposts%2Frandom-users&psig=AOvVaw0eEL3RP_0k-8H0xxH5QgB2&ust=1652709026428000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCODVvovT4fcCFQAAAAAdAAAAABAD",
    phoneNumber: arr[2],
  },
  {
    _id: "",
    message: "Looking cool man",
    name: "Zeus",
    picture:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdota2.fandom.com%2Fwiki%2FZeus&psig=AOvVaw05IDv5eH3L7biw1O32sMgp&ust=1652709262709000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJCQgPnT4fcCFQAAAAAdAAAAABAJ",
    phoneNumber: arr[5],
  },
  {
    _id: "",
    message: "Nice meeting you",
    name: "Ritesh",
    picture:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcreate.arduino.cc%2Fprojecthub%2Friteshmukhopadhyay&psig=AOvVaw06o9_rUWBcAF04QoGDigjU&ust=1652709360577000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCNDPxqfU4fcCFQAAAAAdAAAAABAD",
    phoneNumber: arr[6],
  },
  {
    _id: "",
    message: "Hi see you soon",
    name: "Popeye",
    picture:
      "https://i.pinimg.com/564x/5c/88/f7/5c88f7fd99d165efd76ab318493b57cf.jpg",
    phoneNumber: arr[7],
  },
  {
    _id: "",
    message: "What is this name man",
    name: "Venom",
    picture:
      "https://i.pinimg.com/564x/50/c2/f5/50c2f5a5abe16b081db63cb52257300b.jpg",
    phoneNumber: arr[8],
  },
  {
    _id: "",
    message: "Pop style look man",
    name: "Spidy",
    picture:
      "https://i.pinimg.com/750x/4e/e2/d9/4ee2d99d22e8a3541b247b9fd2dddf18.jpg",
    phoneNumber: arr[9],
  },
  {
    _id: "",
    message: "Give this man a shield :)",
    name: "Cpt. America",
    picture:
      "https://i.pinimg.com/564x/69/fb/96/69fb96ab138323e62c2bac47eee08456.jpg",
    phoneNumber: arr[10],
  },
  {
    _id: "",
    message: "g",
    name: "Wonder lady",
    picture:
      "https://i.pinimg.com/564x/d9/7b/1e/d97b1e0b7ee4e87bf98f333c154b8d2f.jpg",
    phoneNumber: arr[11],
  },
  {
    _id: "",
    message: "You look beautiful girl",
    name: "Crystal Maiden",
    picture:
      "https://i.pinimg.com/736x/76/d9/03/76d90361427a8df0909b9f939f31df24.jpg",
    phoneNumber: arr[12],
  },
  {
    _id: "",
    message: "HI there man hope to see you again.",
    name: "Gamer boi",
    picture:
      "https://i.pinimg.com/564x/21/c8/04/21c8043711b93f105b353f7f82e0488d.jpg",
    phoneNumber: arr[13],
  },
  {
    _id: "",
    message: "",
    name: "Yoda",
    picture:
      "https://i.pinimg.com/564x/0d/9e/6b/0d9e6b830642bb88c37f2decc146bbaf.jpg",
    phoneNumber: arr[14],
  },
  {
    _id: "",
    message: "Great to see you agai man",
    name: "Bat Man",
    picture:
      "https://i.pinimg.com/564x/6b/38/7d/6b387d860c714fa3df102e1dc5a85c38.jpg",
    phoneNumber: arr[15],
  },
  {
    _id: "",
    message: "Nice name dude",
    name: "Gentle Giant",
    picture:
      "https://i.pinimg.com/736x/cc/25/dc/cc25dc1674a4c8d6c38cab5c548f1564.jpg",
    phoneNumber: arr[16],
  },
  {
    _id: "",
    message: "",
    name: "Tyson",
    picture:
      "https://i.pinimg.com/736x/bb/1d/67/bb1d67abf77e3f40325c37c3fb829791.jpg",
    phoneNumber: arr[17],
  },
  {
    _id: "",
    message: "What is wrong with this name",
    name: "Death-Apple",
    picture:
      "https://i.pinimg.com/564x/7f/9f/46/7f9f4651fd1b189c920f816e0b6233af.jpg",
    phoneNumber: arr[18],
  },
  {
    _id: "",
    message: "",
    name: "Mr. Bean",
    picture:
      "https://www.nicepng.com/png/full/37-377378_mr-bean-caricature-mr-bean-cartoon-quotes.png",
    phoneNumber: arr[19],
  },
];

export default usersData;
