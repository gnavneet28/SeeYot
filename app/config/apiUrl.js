import {
  PROD_API_URL,
  PROD_AUTH_TOKEN,
  DEV_API_URL,
  DEV_AUTH_TOKEN,
} from "@env";

const developmentConfig = {
  DEV_API_URL,
  DEV_AUTH_TOKEN,
};

const productionEnvironment = {
  PROD_API_URL,
  PROD_AUTH_TOKEN,
};

export default __DEV__ ? developmentConfig : productionEnvironment;
