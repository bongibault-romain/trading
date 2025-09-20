'use client';

import { SocketProvider } from "@/contexts/socketContext";
import React, { PropsWithChildren } from "react";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SocketProvider>{children}</SocketProvider>
  );
}