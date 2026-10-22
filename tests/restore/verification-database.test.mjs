import { expect, test } from "@jest/globals";
import { verificationDatabase } from "../../src/restore/verification-database.mjs";

test("builds a temporary database name and SQL statements", () => {
  expect(verificationDatabase("application", "restore_verify_")).toEqual({
    name: "restore_verify_application",
    drop: "DROP DATABASE IF EXISTS `restore_verify_application`",
    create: "CREATE DATABASE `restore_verify_application`",
  });
});
