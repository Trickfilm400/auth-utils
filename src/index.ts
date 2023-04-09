import { IAuthUtilsOptions } from "./interfaces/IAuthUtilsOptions";
import { Passport } from "./lib/Passport";
import { Session } from "./lib/Session";
import { ZitadelSessionPermissionsHandler } from "./permissionHandler/ZitadelSessionPermissionsHandler";
import { Request } from "express";
import HTTPUnauthorizedError from "./utils/HTTPUnauthorizedError";

/**
 * @author Nico W.
 * @since 0.0.1
 * @version 0.0.1
 * Initial Version: Passport implementation for AuthUtils for SSO
 */
export class AuthUtils {
  private static authUtils: AuthUtils;
  private readonly passport: Passport;
  private readonly session: Session;
  private readonly obj: IAuthUtilsOptions;
  private constructor(obj: IAuthUtilsOptions) {
    obj.strategy ||= "oidc";
    this.obj = obj;
    this.session = new Session(obj);
    this.passport = new Passport(obj);
    if (this.obj.zitadelRoleMapping)
      ZitadelSessionPermissionsHandler.createPermissionsHandler(
        this.obj.zitadelRoleMapping
      );
  }

  static getAuthUtils() {
    return this.authUtils;
  }

  static createAuthUtils(obj: IAuthUtilsOptions) {
    this.authUtils = new AuthUtils(obj);
    return this.authUtils;
  }

  getPassport() {
    return this.passport;
  }
  getSession(): Session {
    return this.session;
  }

  /**
   * Init Session Storage
   * Init PassPort Strategy's
   * Init Express Routes (login, logout, etc.)
   */
  async initAll() {
    this.session.registerSessionMiddleware();
    await this.passport.registerPassportStrategy();
    this.obj.expressApp.getServer().use(this.passport.getPassportMiddleware());
    this.obj.expressApp
      .getServer()
      .use(this.passport.getPassportSessionMiddleware());
    this.passport.registerExpressRoutes();
  }

  postLoginCallback(user?: Request["user"]): any {
    //implement own logic and this function will be called after a login
    if (typeof this.obj.postLoginFn === "function") this.obj.postLoginFn(user);
  }
}
//re-export for inde file usage
const AuthExceptions = {
  UnauthorizedError: HTTPUnauthorizedError,
};
export * from "./checkLoggedIn";
export * from "./utils/authUtilsConvictConfig";
export { ZitadelSessionPermissionsHandler, AuthExceptions };
export * from "./permissionHandler/AbstractPermissionHandler";
export * from "./interfaces/IUserDBTemplate";
export * from "./permissionHandler/CheckPermission";
