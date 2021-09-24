import apiClient from "./apiClient";

const endPoint = "/verify";

const sendVerificationCode = (numberToVerify) =>
  apiClient.post(endPoint + "/sendNumberToVerify", { numberToVerify });

const verifyNumber = (numberToVerify, code) =>
  apiClient.put(endPoint + "/verifyCode", { numberToVerify, code });

export default {
  sendVerificationCode,
  verifyNumber,
};
