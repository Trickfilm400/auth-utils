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
  constructor(options: IAuthUtilsOptions) {
    this.options = options;
  }

  getPassportMiddleware() {
    passport.serializeUser((user, next) => {
      console.log(user);
      next(null, user);
    });

    passport.deserializeUser((obj: any, next) => {
      console.log(obj);
      next(null, obj);
    });
    return passport.initialize();
  }
  getPassportSessionMiddleware() {
    return passport.session();
  }
  async getOIDC_Client() {
    try {
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
    } catch (e) {
      throw e;
    }
  }

  async registerPassportStrategy() {
    this.client = await this.getOIDC_Client();
    console.log("registerPassportStrategy", this.client);
    passport.use(
      "oidc",
      new Strategy(
        { client: this.client },
        (
          tokenSet: { claims: () => any },
          _userinfo: any,
          done: (arg0: null, arg1: any) => any
        ) => {
          console.log("tokenSet:", tokenSet, "_userInfo", _userinfo);
          return done(null, tokenSet.claims());
        }
      )
    );
  }

  registerExpressRoutes() {
    //login
    this.options.expressApp
      .getServer()
      .get("/login", passport.authenticate("oidc"));
    //login/callback
    this.options.expressApp.getServer().use(
      "/login/callback",
      // (_req: Request, _res: Response, _next: NextFunction) => {
      //(req: any) => {
      //console.log(_req);
      //},

      passport.authenticate(
        "oidc",
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
        req.login(req.user!, (err: any) => {
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
