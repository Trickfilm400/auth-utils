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
   */
  getJWK(options: Pick<JwksRsa.Options, "jwksUri">) {
    this.client = new JwksRsa.JwksClient(options);
  }

  /**
   * get correct jwk signing key for verification
   * @param header - JWT Header
   * @param callback needed because promise is not supported
   */
  async getKey(header: JwtHeader, callback: SigningKeyCallback) {
    //console.log("header:", header);
    try {
      callback(
        null,
        (await this.client.getSigningKey(header.kid)).getPublicKey()
      );
    } catch (e) {
      callback(e);
    }
  }

  /**
   * verify JWT Token (& decoding it)
   * @param accessToken - RAW JWT, no http header supported
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
   * @param bearerToken
   */
  async getTokenPayload<PAYLOAD extends Record<string, string>>(
    bearerToken: string
  ) {
    const jwt = bearerToken.split(" ")[1];
    //console.log("jwt", jwt);
    if (jwt) {
      const user = await this.validateAccessToken<PAYLOAD>(jwt);
      //console.log("user", user);
      if (!user) return null;
      return user;
    }
    return null;
  }
}
