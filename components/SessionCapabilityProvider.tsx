"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React from "react";

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
  if (loading) return <p>Loading session information...</p>;
  if (error) return <p>Unable to load session information: {error.message}</p>;

  console.log(data);

  return <>{children}</>;
};
