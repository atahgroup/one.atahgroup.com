"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React, { useEffect } from "react";

type SessionInfoQueryResult = {
  accountSessionInfo: {
    capabilities: string[];
  };
};

export const SessionCapabilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ACCOUNT_SESSION_INFO = gql`
    query {
      accountSessionInfo {
        capabilities
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
  localStorage.setItem("session_capabilities", JSON.stringify(capabilities));

  return <>{children}</>;
};
