"use client";

import React, { use } from "react";

export type ProtectProps = {
  children: React.ReactNode;
  hasAccess: Promise<boolean>;
};

export function Protect({ children, hasAccess }: ProtectProps) {
  const _hasAccess = use(hasAccess);

  if (!_hasAccess) return null;

  return <>{children}</>;
}
