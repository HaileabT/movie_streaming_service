import crypto from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";

const key = crypto.randomBytes(16).toString("hex");

const fileExists = existsSync(".env");
let newEnvValue = `JWT_SECRET=${key}`;
if (fileExists) {
  const env = readFileSync(".env").toString();

  let found = false;

  let newEnv = env.split("\n").map((line) => {
    if (line.startsWith("JWT_SECRET=")) {
      found = true;
      return `JWT_SECRET=${key}`;
    }
    return line;
  });

  if (!found) {
    newEnv.push(`JWT_SECRET=${key}`);
  }

  newEnvValue = newEnv.join("\n");
}

writeFileSync(".env", newEnvValue);
