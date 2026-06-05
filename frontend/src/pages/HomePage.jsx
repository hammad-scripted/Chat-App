import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

export const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen w-screen bg-base-200 overflow-hidden">
      <div className="flex h-full w-full flex-col md:flex-row pt-16">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

