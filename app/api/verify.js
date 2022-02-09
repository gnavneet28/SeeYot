import apiClient from "./apiClient";

const endPoint = "/verify";

const sendVerificationCode = (numberToVerify, hash) =>
  apiClient.post(endPoint + "/sendNumberToVerify", { numberToVerify, hash });

const verifyNumber = (numberToVerify, code) =>
  apiClient.put(endPoint + "/verifyCode", { numberToVerify, code });

export default {
  sendVerificationCode,
  verifyNumber,
};
