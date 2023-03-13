import { NextFunction, Request, Response } from "express";

/**
 * @author Nico W.
 * @since 0.0.1
 * @version 0.0.1
 * @description Middleware to check auth, if not authenticated, redirect user to login page
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 */
export function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  else return res.redirect("/login");
}
