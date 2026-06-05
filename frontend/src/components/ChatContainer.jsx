import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import NoChatSelected from "./NoChatSelected.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Guard against no selection
    if (!selectedUser) return;

    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // If no user is selected, show placeholder
  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-base-100">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <NoChatSelected />
        </div>
        <MessageInput />
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 min-h-0">
        {messages && messages.map((message, idx) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full border overflow-hidden">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl break-words">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="w-full h-auto rounded-md mb-2 max-h-[45vh] object-cover"
                />
              )}
              {message.text && <p className="break-words">{message.text}</p>}
            </div>
            {/* place messageEndRef on last message to scroll to bottom */}
            {idx === (messages.length - 1) && <div ref={messageEndRef} />}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
