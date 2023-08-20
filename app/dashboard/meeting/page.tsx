'use client'
import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import Webrtc from '../webrtcroom/webrtcroom';
import * as webrtchandler from '../webrtcroom/webrtchandle';
import Peer from 'simple-peer'

export default function Page() {

    const { friends2, setfriends, pendingfriendinvitations, setpendingfriendinvitations, onlineusers, setonlineusers, targetmailaddress, settargetmailaddress, Connectwithsocketserver, newSocket, setNewSocket,
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
        setopenroom, videodisplay, setvideodisplay } = useContext(socketsContext);


    const onlyaudioconstraints = {
        audio: true,
        video: false,
    };
    const defaultconstraints = {
        audio: true,
        video: true,
        // we can also use video:{
        // width:
        // height:
        // }
    };
    const getlocalstreampreview = (onlyaudio = audioonly, callback: any) => {
        const constraints = onlyaudio ? onlyaudioconstraints : defaultconstraints;
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            console.log("localstreampreview func ke andar   ", stream)
            setlocalstream(stream);
            callback()
        }).catch((err) => {
            console.log(err)
        })
    };






    useEffect(() => {
        Connectwithsocketserver();
    }, [])
    //states of the great webrtc dream

    const createnewroom = () => {
        const successcallback = () => {

            console.log("new room being created frontendJ")
            newSocket.emit("room-create")
            console.log("emmitor worminb")
        }
        getlocalstreampreview(audioonly, successcallback)

    }
    //this function is for the room created by us
    const newroomcreated = (data: any) => {
        const { roomdetails } = data;
        setRoomdetails(roomdetails);


    }
    const joinroom = (roomid: any) => {
        const successcallback = () => {

            setRoomdetails({ roomid })
            // setopenroom(false)
            setisuserinroom(true)
            setisusercreator(false)
            newSocket.emit("room-join", { roomid })
            setvideodisplay(!videodisplay)
        }
        getlocalstreampreview(audioonly, successcallback)

    }
    const leaveroom = () => {
        const roomid = Roomdetails.roomid
        if (localstream) {
            localstream.getTracks().forEach((track: any) => {
                track.stop();

            })
            setlocalstream(null);
        }
        newSocket.emit("leave-room", { roomid })
        // setopenroom(false)
        setisuserinroom(false);

    }
    // let peers: any = {};
    // const getconfiguration = ():custompeerconfig => {
    //     const turnIceServers = null;
    //     if (turnIceServers) {
    //         //we need turn server for this 
    //     }
    //     else {
    //         console.warn("using only turn servers")
    //         return {
    //             iceservers: [
    //                 {
    //                     url: 'stun:stun.l.google.com:19302'
    //                 }
    //             ]
    //         }
    //     }
    // }
    interface custompeerconfig{
        iceservers:{
            url:string;
        }
    }[];

    // const preparenewpeerconnection = (connusersocketid: any, isinitiator: any) => {
    //     if (isinitiator) {
    //         console.log("preparing new peer connection as inititator")
    //     }
    //     else {
    //         console.log("preparing room connection as initiator")
    //     }
    //     const peerconfig=getconfiguration()
    //     peers[connusersocketid] = new Peer({
    //         initiator: isinitiator,
    //         config: peerconfig,
    //         stream: localstream
    //     });
    //     peers[connusersocketid].on('signal', (data: any) => {
    //          const signaldata={
    //             signal:data,
    //            connUserSocketId :connusersocketid,
                
    //          }
    //         //  signalpeerdata(signaldata);
    //     })


    // }
    // newSocket.on('conn-prepare', (data: any) => {
    //     console.log("prepare for connections")
    //     console.log(data)

    //     const { connusersocketid } = data;
    //     preparenewpeerconnection(data, false)

    // })

    let x = videodisplay ? 'block' : 'none';

    return (
        <>
            <div>
                <Button variant="contained" onClick={() => { createnewroom() }}>Create meetings</Button>
            </div>
            <div>
                {activerooms && activerooms.map((elem: any, key: number) => {
                    // console.log("MAP KE ANDAR WAKA" ,activerooms)
                    return (
                        <>
                            <div key={key}>
                                <button className='bg-primary' style={{ backgroundColor: 'pink' }} onClick={() => { joinroom(elem.roomid) }}>

                                    {elem.roomid}
                                </button>

                                <button className='bg-primary' style={{ backgroundColor: 'red' }} onClick={() => { leaveroom() }}>

                                    {elem.roomid}
                                </button>
                            </div>

                        </>
                    )

                })}
                <div className={`${x}`}>
                    <Webrtc />
                    {audioonly ? "enabled audio" : "audio disabled"}
                    <button onClick={() => { setaudioonly(!audioonly) }}></button>
                </div>
            </div >
        </>

    )
}
