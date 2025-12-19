import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  ownerAc,
  memberAc,
} from "better-auth/plugins/organization/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  board: ["create", "update", "delete"],
  track: ["create", "update", "delete"],
  tasc: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  board: ["create", "delete", "update"],
  track: ["create", "delete", "update"],
  tasc: ["create", "update", "delete"],
  ...ownerAc.statements,
});

export const employee = ac.newRole({
  board: [],
  track: [],
  tasc: ["create", "delete", "update"],
  ...memberAc.statements,
});
