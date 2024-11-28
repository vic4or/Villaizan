// src/app/SessionProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

const CustomSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default CustomSessionProvider;
