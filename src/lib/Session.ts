import * as expressSession from "express-session";
import { IAuthUtilsOptions } from "../interfaces/IAuthUtilsOptions";
import * as cookieParser from "cookie-parser";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { MemoryStore } from "express-session";
export class Session {
  private readonly obj: IAuthUtilsOptions;
  constructor(obj: IAuthUtilsOptions) {
    if (!obj.cookie) obj.cookie = {};
    obj.cookie.cookieSecret ||= "keyboard cat random secret test string wow";
    obj.cookie.cookieUninitializedSave ||= false;
    this.obj = obj;
  }

  registerSessionMiddleware() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.obj.expressApp
      .getServer()
      .use(cookieParser(this.obj.cookie!.cookieSecret!));
    this.obj.expressApp.getServer().use(
      expressSession({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secret: this.obj.cookie!.cookieSecret!,
        resave: false,
        cookie: {
          sameSite: this.obj.cookie?.cookieOptions?.sameSite || "lax",
          secure: this.obj.cookie?.cookieOptions?.secure,
        },
        store: this.createRedis() || new MemoryStore(),
        saveUninitialized: this.obj.cookie!.cookieUninitializedSave!,
      })
    );
  }

  createRedis() {
    if (!this.obj.cookie?.redisStore) return null;
    const redisClient = createClient({
      //redis[s]://[[username][:password]@][host][:port][/db-number]
      //url: `redis://${this.obj.cookie?.redisStore?.host}`,
      password: this.obj.cookie?.redisStore?.password,
      database: this.obj.cookie?.redisStore?.dbIndex,
      socket: {
        host: this.obj.cookie?.redisStore?.host,
        port: parseInt(this.obj.cookie?.redisStore?.port),
      },
    });
    redisClient.connect().catch(console.error);

    // Initialize store.
    return new RedisStore({
      client: redisClient,
    });
  }
}
