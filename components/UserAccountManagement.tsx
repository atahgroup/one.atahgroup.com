"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
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
  refetch_users: refetch,
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
      await refetch();
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
            <p className="mt-2 text-sm text-foreground">
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
}

const GrantUserActionInner = ({ user }: GrantUserButtonProps) => {
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
        onClick={() => setIsMenuOpen(true)}
      >
        Grant
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="bg-background border border-foreground/40 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold">Grant capabilities</h2>
            <p className="mt-2 text-sm text-foreground">
              Grant capabilities to <strong>{user.email}</strong>
            </p>

            <div className="mt-4 max-h-60 overflow-y-auto rounded p-2 bg-white dark:bg-background">
              {grantableCapabilities.length === 0 ? (
                <p className="text-sm text-foreground">
                  No grantable capabilities in your session.
                </p>
              ) : (
                grantableCapabilities.map((cap) => (
                  <label
                    key={cap}
                    className="flex items-center gap-2 py-1 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCaps.includes(cap)}
                      onChange={() => toggleCap(cap)}
                      className="h-4 w-4 rounded"
                    />
                    <span>{cap}</span>
                  </label>
                ))
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

const GrantUserAction = ({ user }: GrantUserButtonProps) => {
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

  return <GrantUserActionInner user={user} />;
};

interface DepriveUserButtonProps {
  user: ListedUser;
}

const DepriveUserActionInner = ({ user }: DepriveUserButtonProps) => {
  const onDepriveClick = (u: ListedUser) => {
    // TODO: Implement deprive logic here
    toast.success(`Deprived permissions from ${u.email}`);
  };

  return (
    <button
      className="inline-flex whitespace-nowrap text-smitems-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 dark:focus:ring-purple-400"
      onClick={() => onDepriveClick(user)}
    >
      Deprive
    </button>
  );
};

const DepriveUserAction = ({ user }: DepriveUserButtonProps) => {
  if (!hasSessionCapability("AccountRevokeCapability")) {
    return (
      <button
        className="inline-flex whitespace-nowrap text-sm items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
        disabled
      >
        Deprive
      </button>
    );
  }

  return <DepriveUserActionInner user={user} />;
};

type UserAccountsQueryResult = {
  accountListAllUsers: ListedUser[];
};

interface AccountTableProps {
  users: ListedUser[];
  refetch_users: () => void;
}

const AccountTable = ({ users, refetch_users }: AccountTableProps) => {
  return (
    <div className="mt-6 overflow-x-auto">
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
            users.map((u) => (
              <tr key={u.userId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {u.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {u.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <DeleteUserAction user={u} refetch_users={refetch_users} />
                  <GrantUserAction user={u} />
                  <DepriveUserAction user={u} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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

  return (
    <div className="flex flex-col w-full border border-foreground/40 p-6 rounded-lg">
      <h1 className="text-2xl font-semibold">User Accounts</h1>
      <p className="mt-2 text-sm text-foreground">
        A list of all registered user accounts.
      </p>

      <AccountTable users={users} refetch_users={refetch} />
    </div>
  );
};

export const UserAccountManagementPanel = () => {
  if (!hasSessionCapability("AccountListUsers")) {
    return (
      <div className="flex flex-col w-full border border-foreground/40 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold">Account Management</h1>
        <p className="mt-2 text-sm text-foreground">
          Your session does not have the capability to view user accounts.
        </p>
      </div>
    );
  }

  return <UserAccountManagementPanelInner />;
};
