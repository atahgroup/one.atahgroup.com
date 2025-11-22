"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";

type ListedUser = {
  userId: number;
  email: string;
};

type UserAccountsQueryResult = {
  accountListAllUsers: ListedUser[];
};

const UsersTable = ({
  users,
  onDelete,
}: {
  users: ListedUser[];
  onDelete: (u: ListedUser) => void;
}) => {
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 dark:focus:ring-red-400"
                    onClick={() => onDelete(u)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const UserAccountManagementTable = () => {
  const LIST_ALL_USERS = gql`
    query {
      accountListAllUsers {
        userId
        email
      }
    }
  `;

  const DELETE_USER = gql`
    mutation DeleteUser($userId: Int!) {
      accountDeleteUser(userId: $userId)
    }
  `;

  const { loading, error, data, refetch } = useQuery(LIST_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  const [selectedUser, setSelectedUser] = useState<ListedUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Unable to load user information: {error.message}</p>;

  const users = (data as UserAccountsQueryResult).accountListAllUsers;

  const onDeleteClick = (u: ListedUser) => {
    setSelectedUser(u);
    setIsModalOpen(true);
  };

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

  return (
    <>
      <div className="max-w-4xl mx-auto w-full border border-foreground/40 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold">User Accounts</h1>
        <p className="mt-2 text-sm text-gray-600">
          A list of all registered user accounts.
        </p>

        <UsersTable users={users} onDelete={onDeleteClick} />
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="bg-background border border-foreground/40 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold">Confirm delete</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{selectedUser.email}</strong>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 text-black rounded-md"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
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
