export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CurrentSessionInfo = {
  __typename: 'CurrentSessionInfo';
  capabilities: Array<Scalars['String']['output']>;
  user_id: Scalars['Int']['output'];
};

export type ListedUser = {
  __typename: 'ListedUser';
  email: Scalars['String']['output'];
  user_id: Scalars['Int']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  account_create_user: NewUserAccount;
  account_delete_user: Scalars['Boolean']['output'];
  account_grant_capability: Scalars['Boolean']['output'];
  account_revoke_capability: Scalars['Boolean']['output'];
};


export type MutationAccount_Create_UserArgs = {
  email: Scalars['String']['input'];
};


export type MutationAccount_Delete_UserArgs = {
  user_id: Scalars['Int']['input'];
};


export type MutationAccount_Grant_CapabilityArgs = {
  capabilities: Array<Scalars['String']['input']>;
  user_id: Scalars['Int']['input'];
};


export type MutationAccount_Revoke_CapabilityArgs = {
  capabilities: Array<Scalars['String']['input']>;
  user_id: Scalars['Int']['input'];
};

export type NewUserAccount = {
  __typename: 'NewUserAccount';
  capabilities: Array<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  user_id: Scalars['Int']['output'];
};

export type Query = {
  __typename: 'Query';
  account_get_user_capabilities: Array<Scalars['String']['output']>;
  account_list_all_users: Array<ListedUser>;
  account_session_info: CurrentSessionInfo;
};


export type QueryAccount_Get_User_CapabilitiesArgs = {
  user_id: Scalars['Int']['input'];
};
