import React from 'react'
import { CallControls, SpeakerLayout, StreamTheme, CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useNavigate } from 'react-router';

const CallContents = () => {

    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    const navigate = useNavigate();

    if (callingState === CallingState.LEFT) return navigate("/");

    return (
            <StreamTheme>
                <SpeakerLayout />
                <CallControls />
            </StreamTheme>
    )
}

export default CallContents