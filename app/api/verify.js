import apiClient from "./apiClient";

const endPoint = "/verify";

const sendVerificationCode = (numberToVerify, name, hash) =>
  apiClient.post(endPoint + "/sendNumberToVerify", {
    numberToVerify,
    name,
    hash,
  });

const verifyNumber = (numberToVerify, name, code) =>
  apiClient.put(endPoint + "/verifyCode", { numberToVerify, name, code });

export default {
  sendVerificationCode,
  verifyNumber,
};
