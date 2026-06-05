import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-2 sm:p-3 border-b border-base-300 sticky top-0 bg-base-100 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Avatar */}
          <div className="avatar flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full relative overflow-hidden">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="object-cover w-full h-full" />
            </div>
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate text-sm sm:text-base">{selectedUser.fullName}</h3>
            <p className="text-xs sm:text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button className="btn btn-ghost btn-sm btn-circle flex-shrink-0" onClick={() => { setSelectedUser(null); setSidebarOpen(true); }} aria-label="Close chat">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
