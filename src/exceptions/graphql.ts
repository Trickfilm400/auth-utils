import { GraphQLError } from "graphql";

const UNAUTHORIZED = new GraphQLError(
  "You are not authorized to perform this action.",
  {
    extensions: {
      code: "UNAUTHORIZED",
      http: {
        status: 401,
      },
    },
  }
);

export const EXCEPTIONS = {
  UNAUTHORIZED,
};
