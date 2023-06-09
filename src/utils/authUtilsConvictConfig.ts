import { Schema } from "convict";
import { CookieOptions } from "express-session";

export interface authUtilsConvictConfig {
  sso: {
    issuer_url: string;
    client_id: string;
    client_secret: string;
    callback_urls: string[];
    post_logout_redirect_urls: string[];
    strategy: "oidc" | "saml";
    zitadelRoleMapping: string;
    cookieSecret: string;
    cookieUninitializedSave: boolean;
    cookieOptions: Pick<CookieOptions, "sameSite">;
  };
}

export const authUtilsConvictConfigSchema: Schema<authUtilsConvictConfig> = {
  sso: {
    issuer_url: {
      doc: "The issuer url of the SSO",
      format: String,
      default: null,
      env: "SSO_ISSUER_URL",
    },
    client_id: {
      doc: "The client id of the SSO",
      format: String,
      default: null,
      env: "SSO_CLIENT_ID",
    },
    client_secret: {
      doc: "The client secret of the SSO",
      format: String,
      default: null,
      env: "SSO_CLIENT_SECRET",
    },
    callback_urls: {
      doc: "The callback urls of the SSO",
      format: Array,
      default: [],
      env: "SSO_CALLBACK_URLS",
    },
    post_logout_redirect_urls: {
      doc: "The post logout redirect urls of the SSO",
      format: Array,
      default: [],
      env: "SSO_POST_LOGOUT_REDIRECT_URLS",
    },
    strategy: {
      doc: "The strategy to use for authentication",
      format: ["oidc", "saml"],
      default: "oidc",
      env: "SSO_STRATEGY",
    },
    zitadelRoleMapping: {
      doc: "Map the roles to permissions",
      format: String,
      default: "",
      env: "SSO_ZITADEL_ROLE_MAPPING",
    },
    cookieSecret: {
      doc: "Secret for the session cookie",
      format: String,
      default: "",
      env: "SSO_SESSION_COOKIE_SECRET",
    },
    cookieUninitializedSave: {
      doc: "Save empty sessions",
      format: Boolean,
      default: false,
      env: "SSO_SESSION_COOKIE_SAVE_UNINITIALIZED",
    },
    cookieOptions: {
      sameSite: {
        doc: "Set the sameSite option for the session cookie",
        format: ["lax", "strict", "none"],
        default: "lax",
        env: "SSO_SESSION_COOKIE_SAME_SITE",
      },
    },
  },
};
