"use client";
import React, { useState, createContext, useEffect, useContext } from "react";
import { AuthContext } from "./authContext";
import io from "socket.io-client";
export const socketsContext = createContext();

export default function SocketContextProvider({ children }) {
  const { auth, setAuth } = useContext(AuthContext);
  var socket;
  function Connectwithsocketserver() {
    if (auth) {
      console.log("chalaya par nhi chala");
      socket = io("http://localhost:5002", {
        auth: {
          token: auth.token,
        },
      });
      socket.on("connect", () => {
        console.log("successfully connected to the server");
        console.log(socket.id);
        setNewSocket(socket);
      });
      // socket.on("friend", (data) => {
      //     console.log("i am fool", data)
      // })
      socket.on("friend", (data) => {
        // console.log("socket m reieve ho rha h");
        console.log(data);
        const { pendinginvitations } = data;
        setpendingfriendinvitations(pendinginvitations);
      });
      socket.on("friends-list", (data) => {
        console.log(data);
        const { friends } = data;
        setfriends(friends);
      });
      socket.on("room-create", (data) => {
        console.log("Room details");
        console.log("data   ", data);
      });

      socket.on("online-users", (data) => {
        const { onlineusers } = data;
        setonlineusers(onlineusers);
      });
      socket.on("direct-chat-history", (data) => {
        console.log("direct chat history", data);
        const messages = data.messages.reverse();
        setMessageArray(messages);
      });

      socket.on("room-create", (data) => {
        console.log("Room details");
        console.log("data   ", data);
        setopenroom(true);
        setisusercreator(true);
        setisuserinroom(true);
        //   (property) roomdetails: {
        //     roomcreator: {
        //         userid: any;
        //         socketid: any;
        //     };
        //     participants: {
        //         userid: any;
        //         socketid: any;
        //     }[];
        //     roomid: string;
        // }
        let rooms = [...activerooms];

        rooms.push(data);
        console.log("new room added to our own array", rooms);
        setactiverooms(rooms);
      });
      socket.on("active-rooms", (data) => {
        console.log(data)
        // setactiverooms(data)
        const { activerooms } = data;
        let rooms = [];
        console.log("friends2  ", friends2);
        activerooms.forEach((room) => {
          // console.log("active room wla roo m    " ,room)
          friends2.forEach((element) => {
            // console.log(element,  "  the rooms are  " ,room)
            if (element.id === room.roomcreator.userid) {
              console.log("printing", element.id, room.roomcreator.userid);
              rooms.push({ ...room, creatorusername: element.username });
            }
            // console.log(element)
          });
        });
        console.log("active rooms came from socket ", rooms);
        // console.log(rooms)
        setactiverooms(rooms);
      });
    }
  }
const [peers,setpeers]=useState();
  const [friends2, setfriends] = useState([]);
  const [pendingfriendinvitations, setpendingfriendinvitations] = useState([]);
  const [onlineusers, setonlineusers] = useState([]);
  const [targetmailaddress, settargetmailaddress] = useState("");
  const [newSocket, setNewSocket] = useState(null);
  const [messagesArray, setMessageArray] = useState([]);

  //rooms rtc states
  const [isuserinroom, setisuserinroom] = useState(false);
  const [isusercreator, setisusercreator] = useState(false);
  const [Roomdetails, setRoomdetails] = useState(null);
  const [activerooms, setactiverooms] = useState([]);
  const [localstream, setlocalstream] = useState(null);
  const [remotestreams, setremotestreams] = useState([]);
  const [audioonly, setaudioonly] = useState(false);
  const [screensharingstream, setscreensharingstream] = useState(null);
  const [isscreensharingactive, setisscreensharingactive] = useState(false);
  const [openroom, setopenroom] = useState(false);
  const [videodisplay, setvideodisplay] = useState(false);

  //streaming states
  const [stream, setstream] = useState();

  return (
    <socketsContext.Provider
      value={{
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
        messagesArray,
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
        stream,
        setstream,
      }}
    >
      {children}
    </socketsContext.Provider>
  );
}
