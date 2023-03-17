import { NextFunction, Request, Response } from "express";
import HTTPUnauthorizedError from "./utils/HTTPUnauthorizedError";

/**
 * @author Nico W.
 * @since 0.0.1
 * @version 0.0.1
 * @description Middleware to check auth, if not authenticated, redirect user to login page
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 */
export function checkLoggedInAndRedirect(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) return next();
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
export function checkLoggedInAndThrowError(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) return next();
  else throw new HTTPUnauthorizedError(req);
}

/**
 * @author Nico W.
 * @since 0.0.1
 * @version 0.0.1
 * @description Middleware to check auth, Option to select what will happen if not authenticated
 * @param handle Available Options if not authenticated
 */

export function checkLoggedIn(handle: "redirect" | "error") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();
    else {
      if (handle === "error") throw new HTTPUnauthorizedError(req);
      else res.redirect("/login");
    }
  };
}
