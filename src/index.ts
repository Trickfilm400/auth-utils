import { IAuthUtilsOptions } from "./interfaces/IAuthUtilsOptions";
import { Passport } from "./lib/Passport";
import { Session } from "./lib/Session";

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
}

export { checkLoggedIn } from "./checkLoggedIn";
