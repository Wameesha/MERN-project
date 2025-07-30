import { useEffect, useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api"; 
import { useQuery } from "@tanstack/react-query";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

console.log("Stream API Key for video:", STREAM_API_KEY ? "Present" : "Missing");

if (!STREAM_API_KEY) {
  console.error("VITE_STREAM_API_KEY is not set in environment variables");
}


const CallPage = () =>{

  const {id: callId} = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const {authUser, isLoading} = useAuthUser();

  const {data: tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // Only fetch if authUser is available
    onSuccess: (data) => {
      console.log("Stream token received for video:", data);
    },
    onError: (error) => {
      console.error("Error fetching stream token for video:", error);
    },
  });

  useEffect(() => {
    console.log("CallPage state:", {
      authUser: !!authUser,
      tokenData: !!tokenData,
      callId,
      isConnecting,
      client: !!client,
      call: !!call
    });

    const initCall = async () => {
      if(!tokenData?.token || !authUser || !callId) {
        console.log("Missing requirements:", {
          hasToken: !!tokenData?.token,
          hasAuthUser: !!authUser,
          hasCallId: !!callId
        });
        return;
      }

      try {
        console.log("Initializing Stream client...");

        if (!STREAM_API_KEY) {
          throw new Error("Stream API key is missing");
        }

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }

        console.log("Creating video client with user:", user);

        const videoClient = new StreamVideoClient ({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        console.log("Video client created, creating call instance...");

        const callInstance = videoClient.call("default", callId);

        console.log("Joining call...");
        await callInstance.join({create: true});

        console.log("Call joined successfully")

        setClient(videoClient);
        setCall(callInstance)

      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Failed to join call. Please try again."); 
      } finally {
        setIsConnecting(false);
      }
    };

    initCall(); 
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting)  return <PageLoader/>


  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="relative w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
           </StreamVideo>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Unable to Join Call</h2>
              <p className="mb-4">Could not initialize call. Please check:</p>
              <ul className="text-left list-disc list-inside space-y-2">
                <li>Your internet connection</li>
                <li>Camera and microphone permissions</li>
                <li>The call link is valid</li>
              </ul>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div> 
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  console.log("Call state:", callingState);

  useEffect(() => {
    if(callingState === CallingState.LEFT) {
      console.log("User left the call, navigating to home");
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <div className="w-full h-full">
      <StreamTheme>
        <SpeakerLayout/>
        <CallControls />
      </StreamTheme>
    </div>
  );
};

export default CallPage;
