import { App } from "@kopf02/express-utils";
import { Request } from "express";

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
  scopes?: string | string[];
  zitadelRoleMapping?: string;
  cookieSecret?: string;
  postLoginFn?: (user?: Request["user"]) => void;
}
