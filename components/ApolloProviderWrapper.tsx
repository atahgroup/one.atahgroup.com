"use client";

import { HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import React from "react";

export const ApolloProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const client = new ApolloClient({
    link: new HttpLink({ uri: "https://api.atahgroup.com/graphql" }),
    cache: new InMemoryCache(),
  });

  if (!client) {
    return <div>Failed to connect to GraphQL backend.</div>;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
