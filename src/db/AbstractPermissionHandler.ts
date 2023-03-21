import { NextFunction, Request, Response } from "express";

export abstract class AbstractPermissionHandler {
  abstract addPermission(
    issuer: string,
    unique_userId: string,
    permissions: string
  ): unknown;
  abstract revokePermission(
    issuer: string,
    unique_userId: string,
    permissions: string
  ): unknown;
  abstract registerUser(req: Request, _res: Response, next: NextFunction): void;
}
