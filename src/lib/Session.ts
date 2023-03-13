import * as expressSession from "express-session";
import { IAuthUtilsOptions } from "../interfaces/IAuthUtilsOptions";
import * as cookieParser from "cookie-parser";
export class Session {
  private readonly obj: IAuthUtilsOptions;
  constructor(obj: IAuthUtilsOptions) {
    this.obj = obj;
  }

  registerSessionMiddleware() {
    this.obj.expressApp.getServer().use(cookieParser("keyboard cat"));
    this.obj.expressApp.getServer().use(
      expressSession({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
      })
    );
  }
}
