import * as expressSession from "express-session";
import { IAuthUtilsOptions } from "../interfaces/IAuthUtilsOptions";
import * as cookieParser from "cookie-parser";
export class Session {
  private readonly obj: IAuthUtilsOptions;
  constructor(obj: IAuthUtilsOptions) {
    obj.cookieSecret ||= "keyboard cat random secret test string wow";
    obj.cookieUninitializedSave ||= false;
    this.obj = obj;
  }

  registerSessionMiddleware() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.obj.expressApp.getServer().use(cookieParser(this.obj.cookieSecret!));
    this.obj.expressApp.getServer().use(
      expressSession({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secret: this.obj.cookieSecret!,
        resave: false,
        saveUninitialized: this.obj.cookieUninitializedSave,
      })
    );
  }
}
