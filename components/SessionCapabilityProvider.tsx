"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React, { useEffect } from "react";

type SessionInfoQueryResult = {
  accountSessionInfo: {
    userId: string;
    capabilities: string[];
  };
};

export function hasSessionCapability(capability: string) {
  const capabilities = sessionStorage.getItem("session_capabilities");
  if (!capabilities) return false;
  try {
    const capsArray = JSON.parse(capabilities);
    return capsArray.includes(capability);
  } catch {
    return false;
  }
}

export function getSessionUserId(): string | null {
  return sessionStorage.getItem("session_user_id");
}

export const SessionCapabilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ACCOUNT_SESSION_INFO = gql`
    query {
      accountSessionInfo {
        capabilities
        userId
      }
    }
  `;

  const { loading, error, data } = useQuery(ACCOUNT_SESSION_INFO);

  useEffect(() => {
    if (error) {
      window.location.href = "https://www.atahgroup.com";
    }
  }, [error]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Redirecting...</p>;

  const session_info = data as SessionInfoQueryResult;
  const capabilities: string[] = session_info.accountSessionInfo.capabilities;
  const userId: string = session_info.accountSessionInfo.userId;
  sessionStorage.setItem("session_capabilities", JSON.stringify(capabilities));
  sessionStorage.setItem("session_user_id", userId);

  return <>{children}</>;
};
