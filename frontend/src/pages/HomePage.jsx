import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";

export const HomePage = () => {
  return (
    <div className="h-screen w-screen bg-base-200 overflow-hidden">
      <div className="flex h-full w-full flex-col md:flex-row pt-16">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

