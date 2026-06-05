import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300 sticky top-0 bg-base-100 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-10 h-10 rounded-full relative overflow-hidden">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="object-cover w-full h-full" />
            </div>
          </div>

          {/* User info */}
          <div className="min-w-0">
            <h3 className="font-medium truncate">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button className="p-1 rounded-md hover:bg-base-200/50" onClick={() => { setSelectedUser(null); setSidebarOpen(true); }} aria-label="Close chat">
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
