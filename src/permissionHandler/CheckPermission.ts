import { NextFunction, Request, Response } from "express";
import { checkLoggedIn } from "../checkLoggedIn";
import { AbstractPermissionHandler, AuthExceptions } from "../index";

class CheckPermission {
  //
  protected static instance: CheckPermission;
  private readonly permissionHandler: AbstractPermissionHandler;
  protected static createCheckPermission(obj: {
    permissionHandler: AbstractPermissionHandler;
  }) {
    this.instance = new CheckPermission(obj.permissionHandler);
    return this.instance;
  }
  static getCheckPermission(): CheckPermission {
    return this.instance;
  }

  constructor(permissionHandler: AbstractPermissionHandler) {
    this.permissionHandler = permissionHandler;
  }
  //
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loggedInAtController(originalMethod: () => unknown, _context: never) {
    function replacementMethod(
      this: unknown,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      //check permission
      const userLoggedIn = checkLoggedIn.getLoggedInStatusBoolean(req);
      if (!userLoggedIn) return next(new AuthExceptions.UnauthorizedError(req));
      //call org method
      return originalMethod.call(this, req, res, next);
    }

    return replacementMethod;
  }

  isAdmin(req: Request, adminPermission = "admin") {
    return this.permissionHandler.hasPermissions(req, adminPermission);
  }

  hasPermission(req: Request, permissionString: string) {
    return this.permissionHandler.hasPermissions(req, permissionString);
  }

  getPermissions(req: Request) {
    return this.permissionHandler.getPermissions(req);
  }
}

export default CheckPermission;
