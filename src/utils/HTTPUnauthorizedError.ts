import { HttpError, HttpExceptions } from "@kopf02/express-utils";
import { Request } from "express";

class Unauthorized extends HttpExceptions.HttpException {
  private readonly req: Request;
  constructor(req: Request) {
    super(401, "Unauthorized");
    this.req = req;
  }
  getBody(): HttpError<string> {
    return {
      ...super.getBody(),
      error: "No permission found for accessing this resource",
      errorDetails: this.req.path,
    };
  }
}

export default Unauthorized;
