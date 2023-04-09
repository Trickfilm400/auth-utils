import { BaseClient, Issuer, Strategy } from "openid-client";
import * as passport from "passport";
import { IAuthUtilsOptions } from "../interfaces/IAuthUtilsOptions";
import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../index";

/**
 * @author Nico W.
 * @since 0.0.1
 * @version 0.0.1
 * Initial Version: Passport implementation for OIDC
 */
export class Passport {
  private readonly options: IAuthUtilsOptions;
  private client: BaseClient;

  // parse scopes from options (maybe from array) to final string with spaces separator
  private getScopes() {
    if (this.options.scopes) {
      if (Array.isArray(this.options.scopes))
        return this.options.scopes.join(" ");
      else return this.options.scopes;
    } else return "openid";
  }

  private get strategy() {
    return this.options.strategy || "oidc";
  }
  constructor(options: IAuthUtilsOptions) {
    this.options = options;
  }

  getPassportMiddleware() {
    passport.serializeUser((user, next) => {
      console.log(user);
      next(null, user);
    });

    passport.deserializeUser((obj: never, next) => {
      console.log(obj);
      next(null, obj);
    });
    return passport.initialize();
  }
  getPassportSessionMiddleware() {
    return passport.session();
  }
  async getOIDC_Client() {
    const issuer = await Issuer.discover(this.options.credentials.issuerURL);
    console.log(issuer);
    const client = new issuer.Client({
      client_id: this.options.credentials.clientID,
      client_secret: this.options.credentials.clientSecret,
      redirect_uris: this.options.credentials.callbackURLs,
      post_logout_redirect_uris:
        this.options.credentials.postLogoutRedirectURLs,
      token_endpoint_auth_method: "client_secret_post",
    });
    return client;
  }

  async registerPassportStrategy() {
    this.client = await this.getOIDC_Client();
    console.log("registerPassportStrategy", this.client);
    passport.use(
      this.strategy,
      new Strategy(
        { client: this.client },
        (
          tokenSet: { claims: () => unknown },
          _userinfo: unknown,
          done: (arg0: null, arg1: unknown) => unknown
        ) => {
          console.log("tokenSet:", tokenSet, "_userInfo", _userinfo);
          return done(null, tokenSet.claims());
        }
      )
    );
  }

  registerExpressRoutes() {
    //login
    this.options.expressApp.getServer().get(
      "/login",
      passport.authenticate(this.strategy, {
        scope: this.getScopes(),
      })
    );
    //login/callback
    this.options.expressApp.getServer().use(
      "/login/callback",

      passport.authenticate(
        this.strategy,
        {
          failureRedirect: "/error",
          authInfo: true,
          failureMessage: true,
          failWithError: true,
          // session: true,
          // keepSessionInfo: true,
          //passReqToCallback: true,
        }
        // (err: unknown, b: unknown) => {
        //   console.log("err", err, b);
        //   next();
        // }
      ),
      // next();
      //},
      //console.log,
      //(req: Request, _res: Response, next: NextFunction) => {
      //console.log(req);
      // next();
      // },
      (req: Request, res: Response) => {
        console.log("req.user", req.user);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        req.login(req.user!, (err: unknown) => {
          console.log(err);
        });
        AuthUtils.getAuthUtils().postLoginCallback(req.user);
        res.redirect(
          req.query.redirect_uri ? `/${<string>req.query.redirect_uri}` : "/"
        );
      }
    );
    //logout
    this.options.expressApp
      .getServer()
      .get("/logout", (req: Request, res: Response, next: NextFunction) => {
        req.logout((err) => {
          if (err) return next(err);
          req.session.destroy((err) => {
            if (err) return next(err);
            res.redirect("/");
          });
        });
      });
    //endregion
  }
}
