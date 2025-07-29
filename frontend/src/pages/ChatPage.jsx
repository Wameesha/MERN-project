import React, { useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api"; // Named import

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageList,
  MessageInput,
  Window,
  Thread,
} from "stream-chat-react";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

console.log("Stream API Key:", STREAM_API_KEY ? "Present" : "Missing");

 const ChatPage = () =>{

  const {id: targetUserId} = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery ({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // Only fetch if authUser is available
    onSuccess: (data) => {
      console.log("Stream token received:", data);
    },
    onError: (error) => {
      console.error("Error fetching stream token:", error);
    },
    });

  useEffect(() => {
    console.log("ChatPage state:", {
      authUser: !!authUser,
      tokenData: !!tokenData,
      targetUserId,
      loading,
      chatClient: !!chatClient,
      channel: !!channel
    });
    
    const initChat = async () => {
      if(!tokenData?.token || !authUser) {
        console.log("Missing requirements:", { 
          hasToken: !!tokenData?.token, 
          hasAuthUser: !!authUser 
        });
        return;
      }

      try {
        console.log("Intializing stream chat client....");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, tokenData.token);

        //
        const channelID = [authUser._id, targetUserId].sort().join("-");

        //you and me
        //if i start the chat => channelID: [myId, yourId]
        //if you start the chat => channelID: [yourId, myId] => [myId, yourId]

        const currChannel = client.channel("messaging", channelID, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);

      } catch (error) {
        console.error("Error initializing chat:", error); 
        toast.error("Failed to initialize chat. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, targetUserId, channel, chatClient, loading]);

  const handleVideoCall = () => {
    if (channel){
      const callUrl = `${window.location.origin}/call${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me hear: ${callUrl}`,
      });
    }
    toast.success("Video call link sent successfully!");

  }

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-screen flex flex-col">
      {/* This ensures the chat takes remaining space after navbar */}
      <div className="flex-1 overflow-hidden">
        <Chat client={chatClient}>
          <Channel channel={channel}> 
            <div className="w-full h-full relative">
              <CallButton handleVideoCall={handleVideoCall} />
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  )
}
export default ChatPage;