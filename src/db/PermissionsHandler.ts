import { Mysql } from "@kopf02/express-utils";
import { DataSource, DataSourceOptions } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { PermissionsEntity } from "./PermissionsEntity";
import HTTPUnauthorizedError from "../utils/HTTPUnauthorizedError";

export class PermissionsHandler {
  private readonly _db: DataSource;
  private static permissionsHandler: PermissionsHandler;
  private constructor(db: DataSource | Partial<DataSourceOptions>) {
    if (db instanceof DataSource) {
      //use existing connection
      this._db = db;
    } else {
      //create new mysql connection
      Mysql.createAppDataSource(db);
      this._db = Mysql.getAppDataSource();
    }
  }

  static getPermissionsHandler() {
    return this.permissionsHandler;
  }

  static createPermissionsHandler(db: DataSource | Partial<DataSourceOptions>) {
    this.permissionsHandler = new PermissionsHandler(db);
    return this.permissionsHandler;
  }

  private dbTable() {
    return this._db.getRepository(PermissionsEntity);
  }

  checkPerm(_permissionString: string) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      //todo make DB or lib check if user has permission
      const permRes = await this.dbTable().find({});
      if (permRes) {
        next();
      } else throw new HTTPUnauthorizedError(req);
    };
  }

  async addPerm(userID: string, perm: string) {
    await this.dbTable().save({ permissions: perm, unique_userId: userID });
  }

  async revokePerm(userID: string, perm: string) {
    await this.dbTable().delete({ permissions: perm, unique_userId: userID });
  }
  //alias to revokePerm
  deletePerm = this.revokePerm;
}
