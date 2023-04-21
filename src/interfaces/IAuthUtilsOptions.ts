import { App, IRedisConfig } from "@kopf02/express-utils";
import { Request } from "express";
import { CookieOptions } from "express-session";

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
  cookie?: {
    cookieOptions?: CookieOptions;
    cookieSecret?: string;
    cookieUninitializedSave?: boolean;
    cookieRedisStore?: IRedisConfig;
    cookieRedisEnabled?: boolean;
    redisStore?: IRedisConfig;
  };
  postLoginFn?: (user?: Request["user"]) => void;
}
