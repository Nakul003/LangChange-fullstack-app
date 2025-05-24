import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api.js';
import { StreamVideo, StreamVideoClient, StreamCall} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';
import CallContents from '../components/CallContents';

const CallPage = () => {

  const { id:callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const Stream_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  const { data:tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  });

  useEffect(() => {

    const initCall = async()=>{
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser?._id,
          name: authUser?.name,
          image: authUser?.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey: Stream_API_KEY,
          user,
          token: tokenData?.token
        })

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({create:true});

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call, Please try again.");
      } finally{
        setIsConnecting(false)
      }    
    }
    initCall();
  }, [authUser, tokenData, callId])
  
  if (isLoading || isConnecting) return < PageLoader />

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='relative'>
        {client && call ? (
          < StreamVideo client={client} call={call}>
            <StreamCall call={call}>
              <CallContents />
            </StreamCall>
          </ StreamVideo>

        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>Could not initialize call, Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CallPage