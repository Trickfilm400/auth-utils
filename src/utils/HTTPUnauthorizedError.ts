import { HttpError, HttpExceptions } from "@kopf02/express-utils";
import { Request } from "express";

export interface HttpExceptionUnauthorizedInterface {
  req: Request;
  msg?: { title?: string; description?: string };
  requiredPermission?: any;
}

class Unauthorized extends HttpExceptions.HttpException {
  constructor(private obj: HttpExceptionUnauthorizedInterface) {
    super(401, obj.msg?.title || "Unauthorized");
  }
  getBody(): HttpError<{ path: string; requiredPermission?: any }> {
    return {
      ...super.getBody(),
      error:
        this.obj.msg?.description ||
        "No permission found for accessing this resource",
      errorDetails: {
        path: this.obj.req.path,
        requiredPermission: this.obj.requiredPermission,
      },
    };
  }
}

export default Unauthorized;
