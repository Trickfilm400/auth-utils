import { JwksClient } from "jwks-rsa";
import * as jwt from "jsonwebtoken";
import * as JwksRsa from "jwks-rsa";
import { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";

/**
 * graphql auth:
 *
 * frontend implements oidc client and frontend fetches access token from Zitadel
 * this access token will be sent to backend server as auth header
 *
 * auth header will be validated by backend server via JWT
 */
export class AuthUtils {
  private client: JwksClient;

  constructor(jwks_options: Pick<JwksRsa.Options, "jwksUri">) {
    this.getJWK(jwks_options);
  }

  /**
   * get JWKs from SSO Provider
   * @internal
   */
  getJWK(options: Pick<JwksRsa.Options, "jwksUri">) {
    this.client = new JwksRsa.JwksClient(options);
  }

  /**
   * get correct jwk signing key for verification
   * @param header - JWT Header
   * @param callback needed because promise is not supported
   * @internal
   */
  async getKey(header: JwtHeader, callback: SigningKeyCallback) {
    //console.log("header:", header);
    try {
      const signingKey = (
        await this.client.getSigningKey(header.kid)
      ).getPublicKey();
      //cb
      callback(null, signingKey);
    } catch (e) {
      //cb
      callback(e);
    }
  }

  /**
   * verify JWT Token (& decoding it)
   * @param accessToken - RAW JWT, no http header supported
   * @internal
   */
  validateAccessToken<PAYLOAD extends Record<string, string>>(
    accessToken: string
  ): Promise<JwtPayload & PAYLOAD> {
    return new Promise<JwtPayload & PAYLOAD>((resolve, reject) => {
      //console.log("debug, jwt.verify", accessToken);
      jwt.verify(
        accessToken,
        this.getKey.bind(this),
        { algorithms: ["RS256"] },
        function (_err, decoded) {
          //console.log("decoded", decoded, "err", _err);
          if (_err) return reject(_err);
          if (!decoded || typeof decoded === "string")
            return resolve(decoded as any);
          return resolve(decoded as never);
        }
      );
    });
  }

  /**
   * function: validates given auth header value, return JWT payload
   * @param bearerToken - HTTP Auth Header WITH token prefix
   * @param throwError whether to throw error if any error occurs on validating
   * @return {null | Record} null if nothing found, else JWT payload
   * @author Nico W.
   * @version 1.0.1
   * @since June 2023
   * @public
   */
  async getTokenPayload<PAYLOAD extends Record<string, string>>(
    bearerToken: string,
    throwError = true
  ) {
    //runtime check for undefined values
    if (!bearerToken) return null;
    const jwt = bearerToken.split(" ")[1];
    if (!jwt) return null;
    //console.log("jwt", jwt);
    try {
      const payload = await this.validateAccessToken<PAYLOAD>(jwt);
      //console.log("user", user);
      if (!payload) return null;
      return payload;
    } catch (e) {
      if (throwError) throw e;
      return null;
    }
  }
}
