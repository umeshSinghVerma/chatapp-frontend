"use client";
import io from "socket.io-client";

import { AuthContext } from "@/contexts/authContext";
import { useContext, useEffect, useRef } from "react";
import { socketsContext } from "../../contexts/socketcontext";

const socket = useRef();
export default function Connectwithsocketserver() {
  const { auth, setAuth } = useContext(AuthContext);

  // const jwttoken = userdetails.token;
  // {friends2, setfriends,pendingfriendinvitations, setpendingfriendinvitations,onlineusers, setonlineusers,targetmailaddress,settargetmailaddress}
  const {
    friends2,
    setfriends,
    pendingfriendinvitations,
    setpendingfriendinvitations,
    onlineusers,
    setonlineusers,
    targetmailaddress,
    settargetmailaddress,
  } = useContext(socketsContext);

  // socket = io("http://localhost:5002", {
  //   auth: {
  //     token: auth.token,
  //   },
  // });
  useEffect(() => {
    socket.on("connect", () => {
      console.log("successfully connected to the server");
      console.log(socket.id);
    });

    socket.on("friend", (data) => {
      console.log("socket m reieve ho rha h");
      console.log(data);
      // const {pendinginvitations}=data;
      // setpendingfriendinvitations(pendinginvitations)
    });
  }, [socket]);

  useEffect(() => {
    socket.current = io("http://localhost:5002", {
      auth: {
        token: auth.token,
      },
    });
    socket.current.on("friend", (data) => {
      console.log("working hai ye");

      console.log(data);
    });
  }, []);
}
