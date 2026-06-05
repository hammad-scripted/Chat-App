import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, X } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    sidebarOpen,
    setSidebarOpen,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`h-full border-r border-base-300 flex flex-col transition-transform duration-200 bg-base-100
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-16 left-0 z-50 w-72 md:relative md:translate-x-0 md:top-0 lg:w-72`}
      >
        {/* Mobile panel header */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-base-300">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium">Contacts</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(false)} aria-label="Close contacts">
            <X />
          </button>
        </div>
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden md:block">
              Contacts
            </span>
          </div>

          {/* Online filter toggle */}
          <div className="mt-3 hidden md:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) =>
                  setShowOnlineOnly(e.target.checked)
                }
                className="checkbox checkbox-sm"
              />

              <span className="text-sm">
                Show online only
              </span>
            </label>

            <span className="text-xs text-zinc-500">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>

        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto md:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />

                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info */}
              <div className="hidden md:block text-left min-w-0">
                <div className="font-medium truncate">
                  {user.fullName}
                </div>

                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id)
                    ? "Online"
                    : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;