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

const signUpDemo = () => apiClient.post(endPoint + "/demoAccount/google", {});

export default {
  sendVerificationCode,
  signUpDemo,
  verifyNumber,
};
