// import { QRreader } from "react-native-qr-decode-image-camera";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import ImageResizer from "react-native-image-resizer";

// const resize = async (uri) => {
//   let mode = "contain";
//   let onlyScaleDown = false;

//   let resizeTargetSize = 80;

//   const resizedImage = await ImageResizer.createResizedImage(
//     uri,
//     resizeTargetSize,
//     resizeTargetSize,
//     "JPEG",
//     100,
//     0,
//     undefined,
//     false,
//     { mode, onlyScaleDown }
//   );

//   return resizedImage;
// };

// const selectImage = () => {
//   launchImageLibrary({}, async (response) => {
//     // console.log("Response file name = ", response.assets[0].fileName);

//     if (response.didCancel) {
//       console.log("User cancelled image picker");
//     } else if (response.errorMessage) {
//       console.log("ImagePicker Error: ", response.errorMessage);
//     } else {
//       if (response.assets[0].uri) {
//         let path = response.path;
//         if (!path) {
//           path = response.assets[0].uri;
//         }

//         QRreader(path)
//           .then((data) => {
//             Linking.openURL(data);
//             setTimeout(() => {}, 10000);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//     }
//   });
// };
