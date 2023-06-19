import { Schema } from "convict";

export interface IAuthConvictConfig {
  auth: { jwks_url: string; enabled: boolean };
}
/**
 * this can be used to extend your existing convict config
 */
export const AUTH_CONVICT_CONFIG_TEMPLATE: Schema<IAuthConvictConfig> = {
  auth: {
    jwks_url: {
      doc: "URL to the JWKS endpoint",
      format: String,
      default: null,
      env: "AUTH_JWKS_URL",
    },
    enabled: {
      doc: "Whether authentication should be checked",
      format: Boolean,
      default: true,
      env: "AUTH_ENABLED",
    },
  },
};
