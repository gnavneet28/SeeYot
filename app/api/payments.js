import apiClient from "./apiClient";

const endPoint = "/payment";

const createCustomer = (email) =>
  apiClient.post(endPoint + "/newCustomer", { email });

const createPaymentIntent = () =>
  apiClient.post(endPoint + "/create-payment-intent");

const createSetupIntent = () =>
  apiClient.post(endPoint + "/create-setup-intent");

const AddPaymentMethod = (paymentMethodId) =>
  apiClient.post(endPoint + "/addPaymentMethod", { paymentMethodId });

const setSubscription = () => apiClient.post(endPoint + "/subscription");

export default {
  createCustomer,
  createPaymentIntent,
  createSetupIntent,
  AddPaymentMethod,
  setSubscription,
};
