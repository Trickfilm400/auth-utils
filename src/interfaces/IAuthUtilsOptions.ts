import { App } from "@kopf02/express-utils";

export interface IAuthUtilsOptions {
  strategy?: "saml" | "oauth" | "oidc";
  expressApp: App;
  credentials: {
    issuerURL: string;
    clientID: string;
    clientSecret: string;
    callbackURLs: string[];
    postLogoutRedirectURLs: string[];
  };
  zitadelRoleMapping: string;
}
