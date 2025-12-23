"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import { hasSessionCapability } from "./SessionCapabilityProvider";
import {
  DeleteUserAction,
  GrantUserAction,
  ListedUser,
  RevokeUserAction,
} from "./UserAccountActions";

const AccountTableRow = ({
  user,
  refetch_users,
}: {
  user: ListedUser;
  refetch_users: () => void;
}) => {
  const GET_USER_CAPABILITIES = gql`
    query GetUserCapabilities($userId: Int!) {
      accountGetUserCapabilities(userId: $userId)
    }
  `;

  const [getUserCapabilities, { data: existingData, refetch }] = useLazyQuery<{
    accountGetUserCapabilities: string[];
  }>(GET_USER_CAPABILITIES);

  const refreshCapabilities = () => {
    getUserCapabilities({ variables: { userId: user.userId } });
    refetch();
  };

  return (
    <tr key={user.userId}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {user.userId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap space-x-2">
        <DeleteUserAction user={user} refetch_users={refetch_users} />
        <GrantUserAction
          user={user}
          capabilities={existingData?.accountGetUserCapabilities || []}
          refreshCapabilities={refreshCapabilities}
        />
        <RevokeUserAction
          user={user}
          capabilities={existingData?.accountGetUserCapabilities || []}
          refreshCapabilities={refreshCapabilities}
        />
      </td>
    </tr>
  );
};

type UserAccountsQueryResult = {
  accountListAllUsers: ListedUser[];
};

const AccountTableInner = ({
  users,
  refetch_users,
}: {
  users: ListedUser[];
  refetch_users: () => void;
}) => {
  return (
    <div className="mt-6 overflow-x-auto overflow-y-auto max-h-96">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-background">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              User ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-sm text-foreground">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <AccountTableRow
                key={user.userId}
                user={user}
                refetch_users={refetch_users}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const AccountTable = ({
  users,
  refetch_users,
}: {
  users: ListedUser[];
  refetch_users: () => void;
}) => {
  if (!hasSessionCapability("AccountListUsers")) {
    return (
      <div className="mt-6">
        <p className="text-sm text-foreground">
          Your session does not have the capability to view user accounts.
        </p>
      </div>
    );
  }

  return <AccountTableInner users={users} refetch_users={refetch_users} />;
};

type CreateUserAccountResult = {
  accountCreateUser: {
    userId: number;
    email: string;
  };
};

const CreateUserAccount = ({
  refetch_users,
}: {
  refetch_users: undefined | (() => void);
}) => {
  const CREATE_USER = gql`
    mutation CreateUser($email: String!) {
      accountCreateUser(email: $email) {
        userId
        email
      }
    }
  `;

  const [createUser] = useMutation<CreateUserAccountResult, { email: string }>(
    CREATE_USER
  );
  const [email, setEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const validateEmail = (e: string) => {
    return e.length > 3 && e.includes("@");
  };

  const onCreate = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsCreating(true);
    try {
      const res = await createUser({ variables: { email } });
      const created = res?.data?.accountCreateUser;
      if (created) {
        toast.success(`Created user ${created.email} (ID ${created.userId})`);
        setEmail("");
        await refetch_users?.();
      } else {
        toast.error("Create user failed: no data returned");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Create user failed: ${msg ?? "unknown"}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <p className="mt-6 text-sm text-foreground">
        Create a new user account by entering their email address below.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white dark:bg-background text-foreground"
        />
        <button
          className="inline-flex whitespace-nowrap text-sm items-center px-4 py-3 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          onClick={onCreate}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create User"}
        </button>
      </div>
    </div>
  );
};

export const UserAccountManagementPanelInner = () => {
  const LIST_ALL_USERS = gql`
    query {
      accountListAllUsers {
        userId
        email
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(LIST_ALL_USERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Unable to load user information: {error.message}</p>;

  const users = (data as UserAccountsQueryResult).accountListAllUsers;
  const sortedUsers = [...users];
  sortedUsers.sort((a, b) => a.userId - b.userId);

  return (
    <div className="flex flex-col w-full border border-foreground/40 p-6 rounded-lg">
      <h1 className="text-2xl font-semibold">User Accounts</h1>
      <AccountTable users={sortedUsers} refetch_users={refetch} />
      {hasSessionCapability("AccountCreateUser") && (
        <CreateUserAccount refetch_users={refetch} />
      )}
    </div>
  );
};

export const UserAccountManagementPanel = () => {
  if (
    !hasSessionCapability("AccountListUsers") &&
    !hasSessionCapability("AccountCreateUser")
  ) {
    return (
      <div className="flex flex-col w-full border border-foreground/40 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold">Account Management</h1>
        <p className="mt-2 text-sm text-foreground">
          Your session does not have the capability to manage user accounts.
        </p>
      </div>
    );
  }

  if (!hasSessionCapability("AccountListUsers")) {
    return (
      <div className="flex flex-col w-full border border-foreground/40 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold">User Accounts</h1>
        <CreateUserAccount refetch_users={undefined} />
      </div>
    );
  }

  return <UserAccountManagementPanelInner />;
};
