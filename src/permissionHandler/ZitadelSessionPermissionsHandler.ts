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
  private readonly roleMappingConfig: string;
  private readonly roleMapping: Record<string, string>;
  static createPermissionsHandler(
    roleMapping: IAuthUtilsOptions["zitadelRoleMapping"]
  ) {
    return super.registerPermissionsHandler(
      new ZitadelSessionPermissionsHandler(roleMapping)
    );
  }

  static getPermissionsHandler(): ZitadelSessionPermissionsHandler {
    return <ZitadelSessionPermissionsHandler>this.instance;
  }
  private constructor(roleMapping: IAuthUtilsOptions["zitadelRoleMapping"]) {
    super();
    if (!roleMapping) {
      throw new Error("Role Mapping required");
    }
    this.roleMappingConfig = roleMapping;
    this.roleMapping = this.parseEnvConfig();
  }

  parseEnvConfig() {
    //synax: PERMISSION="PERM_STRING=ROLE1,PERM_OTHER=ROLE2"
    const roles = this.roleMappingConfig;
    const roleMapping: Record<string, string> = {};
    roles.split(",").forEach((role) => {
      const [permString, ssoRole] = role.split("=");
      roleMapping[permString.toLowerCase()] = ssoRole.toUpperCase();
    });
    return roleMapping;
  }

  getUserRoles(req: ZitadelUserRequest) {
    if (!req.user || !req.user["urn:zitadel:iam:org:project:roles"]) return [];
    return Object.keys(req.user["urn:zitadel:iam:org:project:roles"]).map(
      (role) => role.toUpperCase()
    );
  }

  checkPerm(
    permissionString: string,
    action: "redirect" | "throwError" = "throwError"
  ) {
    return async (orgReq: Request, res: Response, next: NextFunction) => {
      const req = orgReq as ZitadelUserRequest;
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
        else next(new HTTPUnauthorizedError(req));
      }
    };
  }

  getPermissions(orgReq: Request): string[] {
    const req = orgReq as ZitadelUserRequest;
    //todo make DB or lib check if user has permission
    //user roles:
    const userRoles = this.getUserRoles(req);
    const res: string[] = [];
    Object.keys(this.roleMapping).forEach((permString) => {
      const role = this.roleMapping[permString];
      if (userRoles.includes(role)) res.push(role);
    });
    return res;
  }

  hasPermissions(orgReq: Request, permissionString: string): boolean {
    const req = orgReq as ZitadelUserRequest;
    //todo make DB or lib check if user has permission
    //user roles:
    const userRoles = this.getUserRoles(req);
    //get required role by permission string
    const requiredRole = this.roleMapping[permissionString.toLowerCase()];
    //check if user has perm
    const permRes = userRoles.includes(requiredRole);
    return permRes;
  }
}
