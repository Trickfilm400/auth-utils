import { NextFunction, Request, Response } from "express";
import HTTPUnauthorizedError from "./utils/HTTPUnauthorizedError";

class CheckLoggedIn {
  protected getAuthStatus(req: Request) {
    return req.isAuthenticated();
  }
  /**
   * @author Nico W.
   * @since 0.0.1
   * @version 0.0.1
   * @description Middleware to check auth, if not authenticated, redirect user to login page
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  redirect(req: Request, res: Response, next: NextFunction) {
    if (this.getAuthStatus(req)) return next();
    else return res.redirect("/login");
  }
  /**
   * @author Nico W.
   * @since 0.0.1
   * @version 0.0.1
   * @description Middleware to check auth, if not authenticated, redirect user to login page
   * @param req Express Request
   * @param _res Express Response
   * @param next Express NextFunction
   */
  throwError(req: Request, _res: Response, next: NextFunction) {
    if (req.isAuthenticated()) return next();
    else throw new HTTPUnauthorizedError({ req });
  }

  getLoggedInStatusBoolean(req: Request) {
    return this.getAuthStatus(req);
  }

  /**
   * Null if authenticated, else throws HTTPUnauthorizedError
   * @param req
   */
  getLoggedInStatusError(req: Request) {
    if (this.getAuthStatus(req)) return null;
    else return new HTTPUnauthorizedError({ req });
  }
}

export default CheckLoggedIn;
export const checkLoggedIn = new CheckLoggedIn();
