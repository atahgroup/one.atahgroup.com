import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import {
  getSessionUserId,
  hasSessionCapability,
} from "./SessionCapabilityProvider";

export type ListedUser = {
  userId: number;
  email: string;
};

interface DeleteUserButtonProps {
  refetch_users: () => void;
  user: ListedUser;
}

interface GrantUserButtonProps {
  user: ListedUser;
  refreshCapabilities: () => void;
  capabilities: string[];
}

interface RevokeUserButtonProps {
  user: ListedUser;
  refreshCapabilities: () => void;
  capabilities: string[];
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

export const DeleteUserAction = ({
  user,
  refetch_users: refetch,
}: DeleteUserButtonProps) => {
  if (
    !hasSessionCapability("AccountDeleteUser") ||
    getSessionUserId() === String(user.userId)
  ) {
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

const GrantUserActionInner = ({
  user,
  capabilities,
  refreshCapabilities,
}: GrantUserButtonProps) => {
  const grantableCapabilities: string[] =
    (typeof window !== "undefined" &&
      JSON.parse(sessionStorage.getItem("session_capabilities") || "[]")) ||
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

export const GrantUserAction = ({
  user,
  capabilities,
  refreshCapabilities,
}: GrantUserButtonProps) => {
  if (
    !hasSessionCapability("AccountGrantCapability") ||
    getSessionUserId() === String(user.userId)
  ) {
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

const RevokeUserActionInner = ({
  user,
  refreshCapabilities,
  capabilities,
}: RevokeUserButtonProps) => {
  const deprivableCapabilities: string[] =
    (typeof window !== "undefined" &&
      JSON.parse(sessionStorage.getItem("session_capabilities") || "[]")) ||
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

export const RevokeUserAction = ({
  user,
  refreshCapabilities,
  capabilities,
}: RevokeUserButtonProps) => {
  if (
    !hasSessionCapability("AccountRevokeCapability") ||
    getSessionUserId() === String(user.userId)
  ) {
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
