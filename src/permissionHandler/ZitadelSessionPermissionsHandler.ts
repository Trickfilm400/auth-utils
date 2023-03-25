import { NextFunction, Request, Response } from "express";
import HTTPUnauthorizedError from "../utils/HTTPUnauthorizedError";
import { AbstractPermissionHandler } from "./AbstractPermissionHandler";
import { IAuthUtilsOptions } from "../interfaces/IAuthUtilsOptions";

export interface ZitadelUserRequest extends Request {
  user: {
    [key: string]: any;
  };
}

export class ZitadelSessionPermissionsHandler extends AbstractPermissionHandler {
  private readonly obj: IAuthUtilsOptions;
  private readonly roleMapping: Record<string, string>;
  static createPermissionsHandler(obj: IAuthUtilsOptions) {
    return super.registerPermissionsHandler(
      new ZitadelSessionPermissionsHandler(obj)
    );
  }
  private constructor(obj: IAuthUtilsOptions) {
    super();
    this.obj = obj;
    this.roleMapping = this.parseEnvConfig();
  }

  parseEnvConfig() {
    //synax: PERMISSION="PERM_STRING=ROLE1,PERM_OTHER=ROLE2"
    const roles = this.obj.zitadelRoleMapping;
    const roleMapping: Record<string, string> = {};
    roles.split(",").forEach((role) => {
      const [permString, ssoRole] = role.split("=");
      roleMapping[permString.toLowerCase()] = ssoRole.toUpperCase();
    });
    return roleMapping;
  }

  getUserRoles(req: ZitadelUserRequest) {
    if (req.user && !req.user["urn:zitadel:iam:org:project:roles"]) return [];
    return Object.keys(req.user["urn:zitadel:iam:org:project:roles"]).map(
      (role) => role.toUpperCase()
    );
  }

  checkPerm(
    permissionString: string,
    action: "redirect" | "throwError" = "throwError"
  ) {
    return async (
      req: ZitadelUserRequest,
      res: Response,
      next: NextFunction
    ) => {
      //todo make DB or lib check if user has permission
      //user roles:
      const userRoles = this.getUserRoles(req);
      //get required role by permission string
      const requiredRole = this.roleMapping[permissionString.toLowerCase()];
      //check if user has perm
      const permRes = userRoles.includes(requiredRole);
      if (permRes) {
        //if authorized
        next();
      } else {
        //not authorized
        if (action === "redirect") res.redirect("/login");
        else throw new HTTPUnauthorizedError(req);
      }
    };
  }
}
