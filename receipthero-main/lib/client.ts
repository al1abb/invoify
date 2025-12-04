import { Together } from "together-ai";

const APP_NAME_HELICONE = "receipthero";

const baseSDKOptions: ConstructorParameters<typeof Together>[0] = {
  apiKey: process.env.TOGETHER_API_KEY || "dummy-key-for-build",
};

if (process.env.HELICONE_API_KEY) {
  baseSDKOptions.baseURL = "https://together.helicone.ai/v1";
  baseSDKOptions.defaultHeaders = {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    "Helicone-Property-Appname": APP_NAME_HELICONE,
  };
}

export const togetheraiClient = new Together(baseSDKOptions);
