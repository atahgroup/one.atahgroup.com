"use client";

import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import { hasSessionCapability } from "./SessionCapabilityProvider";

type ListedUser = {
  userId: number;
  email: string;
};

interface DeleteUserButtonProps {
  refetch_users: () => void;
  user: ListedUser;
}

const DeleteUserActionInner = ({
  user,
  refetch_users,
}: DeleteUserButtonProps) => {
  const DELETE_USER = gql`
    mutation DeleteUser($userId: Int!) {
      accountDeleteUser(userId: $userId)
    }
  `;

  const [deleteUser] = useMutation(DELETE_USER);
  const [selectedUser, setSelectedUser] = useState<ListedUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      await deleteUser({ variables: { userId: selectedUser.userId } });
      toast.success(`Deleted ${selectedUser.email}`);
      setIsModalOpen(false);
      setSelectedUser(null);
      await refetch_users();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Delete failed: ${msg ?? "unknown"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const onDeleteClick = (u: ListedUser) => {
    setSelectedUser(u);
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        className="inline-flex whitespace-nowrap text-sm items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 dark:focus:ring-red-400"
        onClick={() => onDeleteClick(user)}
      >
        Delete
      </button>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="bg-background border border-foreground/40 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold">Confirm delete</h2>
            <p className="mt-2 text-sm text-foreground text-wrap">
              Are you sure you want to delete{" "}
              <strong>{selectedUser.email}</strong>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-background rounded-md bg-foreground/50 hover:bg-foreground/60"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DeleteUserAction = ({
  user,
  refetch_users: refetch,
}: DeleteUserButtonProps) => {
  if (!hasSessionCapability("AccountDeleteUser")) {
    return (
      <button
        className="inline-flex whitespace-nowrap text-sm items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
        disabled
      >
        Delete
      </button>
    );
  }

  return <DeleteUserActionInner user={user} refetch_users={refetch} />;
};

interface GrantUserButtonProps {
  user: ListedUser;
  refreshCapabilities: () => void;
  capabilities: string[];
}

const GrantUserActionInner = ({
  user,
  capabilities,
  refreshCapabilities,
}: GrantUserButtonProps) => {
  const grantableCapabilities: string[] =
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("session_capabilities") || "[]")) ||
    [];

  const GRANT_CAPABILITIES = gql`
    mutation GrantCapability($userId: Int!, $capabilities: [String!]!) {
      accountGrantCapability(userId: $userId, capabilities: $capabilities)
    }
  `;

  const [grantCapabilities] = useMutation(GRANT_CAPABILITIES);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCaps, setSelectedCaps] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCap = (cap: string) => {
    setSelectedCaps((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const onConfirmGrant = async () => {
    if (selectedCaps.length === 0) {
      toast.error("Please select at least one capability to grant.");
      return;
    }
    setIsProcessing(true);
    try {
      await grantCapabilities({
        variables: { userId: user.userId, capabilities: selectedCaps },
      });
      toast.success(`Granted ${selectedCaps.join(", ")} to ${user.email}`);
      setIsMenuOpen(false);
      setSelectedCaps([]);
      refreshCapabilities();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Grant failed: ${msg ?? "unknown"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        className="inline-flex whitespace-nowrap items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 dark:focus:ring-green-400"
        onClick={() => {
          setIsMenuOpen(true);
          refreshCapabilities();
        }}
      >
        Grant
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="bg-background border border-foreground/40 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold">Grant capabilities</h2>
            <p className="mt-2 text-sm text-foreground text-wrap">
              Grant capabilities to <strong>{user.email}</strong>
            </p>

            <div className="mt-4 max-h-60 overflow-y-auto rounded p-2 bg-white dark:bg-background">
              {grantableCapabilities.length === 0 ? (
                <p className="text-sm text-foreground">
                  No grantable capabilities in your session.
                </p>
              ) : (
                grantableCapabilities.map((cap) => {
                  const already = capabilities.includes(cap);
                  return (
                    <div key={cap} className="py-1">
                      {already ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {cap} (already granted)
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={selectedCaps.includes(cap)}
                            onChange={() => toggleCap(cap)}
                            className="h-4 w-4 rounded"
                          />
                          <span>{cap}</span>
                        </label>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200"
                onClick={() => {
                  setIsMenuOpen(false);
                  setSelectedCaps([]);
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={onConfirmGrant}
                disabled={isProcessing || grantableCapabilities.length === 0}
              >
                {isProcessing ? "Granting..." : "Confirm Grant"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const GrantUserAction = ({
  user,
  capabilities,
  refreshCapabilities,
}: GrantUserButtonProps) => {
  if (!hasSessionCapability("AccountGrantCapability")) {
    return (
      <button
        className="inline-flex whitespace-nowrap text-sm items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
        disabled
      >
        Grant
      </button>
    );
  }

  return (
    <GrantUserActionInner
      user={user}
      capabilities={capabilities}
      refreshCapabilities={refreshCapabilities}
    />
  );
};

interface RevokeUserButtonProps {
  user: ListedUser;
  refreshCapabilities: () => void;
  capabilities: string[];
}

const RevokeUserActionInner = ({
  user,
  refreshCapabilities,
  capabilities,
}: RevokeUserButtonProps) => {
  const deprivableCapabilities: string[] =
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("session_capabilities") || "[]")) ||
    [];

  const REVOKE_CAPABILITIES = gql`
    mutation RevokeCapability($userId: Int!, $capabilities: [String!]!) {
      accountRevokeCapability(userId: $userId, capabilities: $capabilities)
    }
  `;

  const [revokeCapabilities] = useMutation(REVOKE_CAPABILITIES);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCaps, setSelectedCaps] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCap = (cap: string) => {
    setSelectedCaps((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const onConfirmRevoke = async () => {
    if (selectedCaps.length === 0) {
      toast.error("Please select at least one capability to revoke.");
      return;
    }
    setIsProcessing(true);
    try {
      await revokeCapabilities({
        variables: { userId: user.userId, capabilities: selectedCaps },
      });
      toast.success(`Revoked ${selectedCaps.join(", ")} from ${user.email}`);
      setIsMenuOpen(false);
      setSelectedCaps([]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Revoke failed: ${msg ?? "unknown"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        className="inline-flex whitespace-nowrap text-sm items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 dark:focus:ring-purple-400"
        onClick={() => {
          setIsMenuOpen(true);
          refreshCapabilities();
        }}
      >
        Revoke
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="bg-background border border-foreground/40 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold">Revoke capabilities</h2>
            <p className="mt-2 text-sm text-foreground text-wrap">
              Revoke capabilities from <strong>{user.email}</strong>
            </p>

            <div className="mt-4 max-h-60 overflow-y-auto rounded p-2 bg-white dark:bg-background">
              {capabilities.length === 0 && (
                <p className="text-sm text-foreground">
                  This user has no capabilities.
                </p>
              )}

              {(() => {
                const valid = capabilities.filter((c) =>
                  deprivableCapabilities.includes(c)
                );
                return valid.map((cap) => (
                  <div key={cap} className="py-1">
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedCaps.includes(cap)}
                        onChange={() => toggleCap(cap)}
                        className="h-4 w-4 rounded"
                      />
                      <span>{cap}</span>
                    </label>
                  </div>
                ));
              })()}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200"
                onClick={() => {
                  setIsMenuOpen(false);
                  setSelectedCaps([]);
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={onConfirmRevoke}
                disabled={isProcessing}
              >
                {isProcessing ? "Revoking..." : "Confirm Revoke"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RevokeUserAction = ({
  user,
  refreshCapabilities,
  capabilities,
}: RevokeUserButtonProps) => {
  if (!hasSessionCapability("AccountRevokeCapability")) {
    return (
      <button
        className="inline-flex whitespace-nowrap text-sm items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
        disabled
      >
        Revoke
      </button>
    );
  }

  return (
    <RevokeUserActionInner
      user={user}
      refreshCapabilities={refreshCapabilities}
      capabilities={capabilities}
    />
  );
};

interface AccountTableRowProps {
  user: ListedUser;
  refetch_users: () => void;
}

const AccountTableRow = ({ user, refetch_users }: AccountTableRowProps) => {
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

interface AccountTableProps {
  users: ListedUser[];
  refetch_users: () => void;
}

const AccountTableInner = ({ users, refetch_users }: AccountTableProps) => {
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

const AccountTable = ({ users, refetch_users }: AccountTableProps) => {
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

interface CreateUserAccountProps {
  refetch_users: undefined | (() => void);
}

type CreateUserAccountResult = {
  accountCreateUser: {
    userId: number;
    email: string;
  };
};

const CreateUserAccount = ({ refetch_users }: CreateUserAccountProps) => {
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
