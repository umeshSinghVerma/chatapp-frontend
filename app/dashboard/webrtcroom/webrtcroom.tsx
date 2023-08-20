'use client'

import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import { IconButton } from '@mui/material';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpeninFullIcon from '@mui/icons-material/OpenInFull';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CloseIcon from '@mui/icons-material/Close';//cut
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import axios from 'axios';
import { trace } from 'console';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import io from "socket.io-client";
import Video from './video';
// import { socketsContext } from "@/contexts/socketcontext";

const fullscreenroomstyle = {
    width: "100%",
    height: "100%"
}
const minimizedroomstyle = {
    bottom: "0px",
    right: "0px",
    width: "30%",
    height: "40vh"
}

export default function Webrtc() {



    const {
        friends2,
        setfriends,
        pendingfriendinvitations,
        setpendingfriendinvitations,
        onlineusers,
        setonlineusers,
        targetmailaddress,
        settargetmailaddress,
        Connectwithsocketserver,
        newSocket,
        setNewSocket,
        isuserinroom,
        setisuserinroom,
        isusercreator,
        setisusercreator,
        Roomdetails,
        setRoomdetails,
        activerooms,
        setactiverooms,
        localstream,
        setlocalstream,
        remotestreams,
        setremotestreams,
        audioonly,
        setaudioonly,
        screensharingstream,
        setscreensharingstream,
        isscreensharingactive,
        setisscreensharingactive,
        openroom,
        setopenroom,
        videodisplay,
        setvideodisplay,
    } = useContext(socketsContext);















    const [micActive, setMicActive] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [screenSharing, setScreenSharing] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    const [isroominimized, setisroomminimized] = useState(true);
    const roomresizehandler = () => {
        setisroomminimized(!isroominimized)
    }

    useEffect(() => {
        // Function to get the current time in the desired format
        function getCurrentTime() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const period = hours >= 12 ? 'pm' : 'am';

            // Convert hours to 12-hour format
            const hours12 = hours % 12 || 12;

            // Add leading zero for single-digit minutes
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

            return `${hours12}:${formattedMinutes} ${period}`;
        }

        // Update the current time every second
        const intervalId = setInterval(() => {
            const time = getCurrentTime();
            setCurrentTime(time);
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const Videocontainer = () => {
        return (
            <>
                <div style={{ height: "85%", width: "100%", display: "flex", flexWrap: "wrap" }}>

                    <Video stream={localstream} isLocalStream={false} />
                </div>

            </>
        )

    }
    return (
        <>
            <div className='flex flex-col rounded-xl bg-[#202225]' style={isroominimized ? minimizedroomstyle : fullscreenroomstyle}>
                <div className='flex-grow'>
                    <Videocontainer />
                </div>
                <div className='flex items-center justify-between gap-1 mx-4' style={isroominimized ? { marginBottom: "8px" } : { marginBlock: "20px" }}>
                    <div>
                        <p className='font-semibold text-white cursor-default' style={isroominimized ? { fontSize: "small" } : { fontSize: "medium" }}>{currentTime}</p>
                    </div>
                    <div className='flex items-center justify-between gap-3'>
                        <div onClick={() => { setScreenSharing(prev => !prev) }}>
                            {screenSharing ?
                                <IconButton style={{ color: 'white', backgroundColor: "#3c4043" }}>
                                    <ScreenShareIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />
                                </IconButton> :
                                <IconButton style={{ color: 'white', backgroundColor: "red" }}>
                                    <StopScreenShareIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />
                                </IconButton>
                            }
                        </div>
                        <div onClick={() => { setMicActive(prev => !prev) }}>
                            {micActive ?
                                <IconButton style={{ color: 'white', backgroundColor: "#3c4043" }}>
                                    <MicIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />
                                </IconButton> :
                                <IconButton style={{ color: 'white', backgroundColor: "red" }}>
                                    <MicOffIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />
                                </IconButton>
                            }
                        </div>
                        <div onClick={() => { setCameraActive(prev => !prev) }}>
                            {cameraActive ?
                                <IconButton style={{ color: 'white', backgroundColor: "#3c4043" }}>
                                    <VideocamIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />
                                </IconButton> :
                                <IconButton style={{ color: 'white', backgroundColor: "red", fontSize: "large" }}>
                                    <VideocamOffIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />
                                </IconButton>
                            }
                        </div>
                        <div>
                            <IconButton style={{ color: 'white', backgroundColor: "red" }}>
                                <CallEndIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />
                            </IconButton>
                        </div>
                    </div>
                    <div>
                        <IconButton style={{ color: 'white' }} onClick={() => { roomresizehandler(); }}>
                            {isroominimized ? <OpeninFullIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} /> : <CloseFullscreenIcon style={isroominimized ? { fontSize: "small" } : { fontSize: "large" }} />}
                        </IconButton>
                    </div>
                </div>
            </div>
        </>
    )
}