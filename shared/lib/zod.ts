import { z } from "zod";

z.config({
  customError: (issue) =>
    issue.code === "invalid_type"
      ? issue.input === undefined
        ? "Required"
        : "Invalid value"
      : undefined,
});

export { z };
