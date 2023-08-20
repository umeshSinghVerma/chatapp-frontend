'use client'
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import axios from 'axios';
import { trace } from 'console';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState, useRef } from 'react'
import io from "socket.io-client";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
const CssTextField = styled(TextField)({

    '& label.Mui-focused': {
        color: 'red',
    },
    '& .MuiInput-underline:after': {
        borderBottomWidth: '0',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderWidth: '0',
        },
        '&:hover fieldset': {
            borderWidth: '0',
        },
        '&.Mui-focused fieldset': {
            borderWidth: '0',
        },
    },
    '& .MuiInputBase-root': {
        margin: '8px', // Set margin to 0
        padding: '0',

    },
    '& .MuiInputBase-input': {
        fontSize: '16px',
        color: 'white',
    },
});
import Webrtc from '../webrtcroom/webrtcroom';
import { IconButton } from '@mui/material';
import Link from 'next/link';

export default function Page() {
    // const friends = [
    //     {
    //         name: "Hello",
    //         imageUrl: ""
    //     },
    //     {
    //         name: "Ramesh",
    //         imageUrl: ""
    //     }
    // ]
    const messagesarray = [
        {
            owner: true,
            messageText: "hello",
            timeStamp: "2pm"
        },
        {
            owner: false,
            messageText: "brother",
            timeStamp: "2pm"
        }
    ]


    // const [openroom,setopenroom]=useState<boolean>();



    const { auth, setAuth } = useContext(AuthContext);
    const { friends2, setfriends, pendingfriendinvitations, setpendingfriendinvitations, onlineusers, setonlineusers, targetmailaddress, settargetmailaddress, Connectwithsocketserver, newSocket, setNewSocket, messagesArray } = useContext(socketsContext);
    const [activeFriend, setActiveFriend] = useState<any>(null);
    const router = useRouter();
    const [chattype, setchattype] = useState<any>("");
    const [chatactions, setchatactions] = useState<any>("");
    const [messages, setmessages] = useState<any[]>([]);
    const [message, setmessage] = useState<any>("");
    const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false);

    // window.friend = activeFriend;
    // window.autth = auth;



    useEffect(() => {
        if (!auth) {
            router.push('/login');
        }
    }, [auth])

    useEffect(() => {
        Connectwithsocketserver();
    }, [])

    const sendfriendinvitation = async (data: object) => {
        try {
            const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/invite",
                data
            )
            console.log("invitation bhij gya")
            console.log(friendinvitation)
            settargetmailaddress("");
        }
        catch (err) {

            console.log(err)

        }

    }
    async function declineInvitation(senderId: any) {
        // http://localhost:5002/v1/api/friend-invitation/invite
        const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/reject",
            {
                id: senderId,
                token: auth.token
            }
        )
        console.log(friendinvitation)
    }
    async function acceptInvitation(senderId: any, invitationId: any) {
        try {
            const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/accept",
                {
                    id: senderId,
                    invitationId,
                    token: auth.token
                })
            console.log(friendinvitation)


        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (activeFriend) {
            console.log("use effect chala active wala");
            getDirectChatHistory(activeFriend.id);
        }
    }, [activeFriend])




    // window.list = pendingfriendinvitations;
    // function Connectwithsocketserver() {
    //     if (auth) {
    //         // console.log("chalaya par nhi chala")
    //         socket = io("http://localhost:5002", {
    //             auth: {
    //                 token: auth.token
    //             }
    //         });
    //         socket.on("connect", () => {
    //             console.log("successfully connected to the server");
    //             console.log(socket.id);
    //             setNewSocket(socket);
    //         });
    //         // socket.on("friend", (data) => {
    //         //     console.log("i am fool", data)
    //         // })
    //         socket.on("friend", (data: any) => {
    //             // console.log("socket m reieve ho rha h"); 
    //             console.log(data);
    //             const { pendinginvitations } = data;
    //             setpendingfriendinvitations(pendinginvitations)
    //         });
    //         socket.on("friends-list", (data: any) => {
    //             console.log(data)
    //             const { friends } = data;
    //             setfriends(friends);

    //         })
    //         socket.on("room-create", (data: any) => {
    //             console.log('Room details')
    //             console.log('data   ', data)
    //         })


    //         socket.on("online-users", (data: any) => {
    //             const { onlineusers } = data;
    //             setonlineusers(onlineusers)
    //         })
    //         socket.on("direct-chat-history", (data: any) => {
    //             console.log('direct chat history', data)
    //             const messages = data.messages.reverse();
    //             setMessageArray(messages);
    //         })
    //     }
    // }
    const senddirectmessage = (data: any) => {
        newSocket.emit("direct-message", data)
    }
    const getDirectChatHistory = (id: any) => {
        newSocket.emit("direct-chat-history", { recieveuserid: id })
    }


    // const createnewroom = () => {
    //     console.log("new room being created frontendJ")
    //     newSocket.emit("room-create")
    //     console.log("emmitor worminb")
    // }
    // const newroomcreated = (data: any) => {
    //     const { roomdetails } = data;
    //     setRoomdetails(roomdetails);


    // }
    const handlesendmessage = () => {
        console.log("sending message to the server")
        // setmessages()
        // setmessage("");
        if (message.length > 0) {
            senddirectmessage({
                //active message wale ki id
                // recieveuserId:
                content: message,
                recieveuserid: activeFriend.id
            })
            setmessage("");
        }

    }

    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        // Function to handle clicks outside the emoji picker
        const handleOutsideClick = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setIsOpenEmojiPicker(false);
            }
        };

        // Add event listener when the emoji picker is open
        if (isOpenEmojiPicker) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        // Remove event listener on unmount and when the picker is closed
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpenEmojiPicker]);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Scroll to the bottom of the chat when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messagesArray]);

    // window.friend = friends2;



    return (
        <>
            {auth && <div className='flex flex-col w-screen h-screen'>
                <nav className="z-50 w-full bg-white border-b border-gray-200 dark:bg-[#272727] dark:border-gray-700">
                    <div className="px-3 py-3 lg:px-5 lg:pl-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start">
                                <button
                                    data-drawer-target="logo-sidebar"
                                    data-drawer-toggle="logo-sidebar"
                                    aria-controls="logo-sidebar"
                                    type="button"
                                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    onClick={() => {
                                        document.getElementById('dropdown-user')?.classList.toggle('hidden');
                                    }}
                                >
                                    <span className="sr-only">Open sidebar</span>
                                    <svg
                                        className="w-6 h-6"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                        />
                                    </svg>
                                </button>
                                <a href="https://flowbite.com" className="flex ml-2 md:mr-24">
                                    <img
                                        src="https://flowbite.com/docs/images/logo.svg"
                                        className="h-8 mr-3"
                                        alt="FlowBite Logo"
                                    />
                                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                        Flowbite
                                    </span>
                                </a>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='relative'>
                                    <div>
                                        <IconButton style={{ color: "white" }} onClick={() => {
                                            document.getElementById("notification")?.classList.toggle("hidden");
                                        }}>
                                            <NotificationsActiveIcon />
                                        </IconButton>
                                    </div>
                                    {pendingfriendinvitations.length > 0 && <div className='absolute -top-1 -right-1 text-xs text-white w-4 h-4 flex items-center justify-center bg-red-500 rounded-[50%]'>
                                        {pendingfriendinvitations.length}
                                    </div>}
                                    <div
                                        className="z-50 hidden  my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-5 right-0 min-w-[200px]"
                                        id="notification"
                                    >
                                        {
                                            pendingfriendinvitations.map((friend: any, key: number) => {
                                                return (
                                                    <>
                                                        <div key={key} className='flex items-center justify-between w-full p-3'>
                                                            <div className='flex items-center gap-3'>
                                                                <img
                                                                    className="w-8 h-8 border rounded-full"
                                                                    src={`${friend.senderId.profile}`}
                                                                    alt="user photo"
                                                                />
                                                                <p>{friend.senderId.username}</p>
                                                            </div>
                                                            <div className='flex gap-2'>
                                                                <button onClick={() => {
                                                                    declineInvitation(friend._id)
                                                                }}>
                                                                    <img src="/cross.svg" alt="" width={16} height={16} />
                                                                </button>
                                                                <button onClick={() => {
                                                                    acceptInvitation(friend.senderId._id, friend._id)
                                                                }}>
                                                                    <img src="/check.svg" alt="" width={20} height={20} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <Link href={"/dashboard/meeting"} className='text-white'>Meeting</Link>
                                <div className="flex items-center">
                                    <div className="relative flex items-center ml-3">
                                        <div>
                                            <button
                                                type="button"
                                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                                aria-expanded="false"
                                                data-dropdown-toggle="dropdown-user"
                                            >
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src={`${auth.profile}`}
                                                    alt="user photo"
                                                    onClick={() => {
                                                        document.getElementById("dropdown-user")?.classList.toggle("hidden");
                                                    }}
                                                />
                                            </button>
                                        </div>
                                        <div
                                            className="absolute right-0 z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 top-5"
                                            id="dropdown-user"
                                        >
                                            <div className="px-4 py-3" role="none">
                                                <p
                                                    className="text-sm text-gray-900 dark:text-white"
                                                    role="none"
                                                >
                                                    {auth.username}
                                                </p>
                                                <p
                                                    className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                                    role="none"
                                                >
                                                    {auth.email || auth.mail}
                                                </p>
                                            </div>
                                            <ul className="py-1" role="none">
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        Dashboard
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        Settings
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        Earnings
                                                    </a>
                                                </li>
                                                <li>
                                                    <button
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            localStorage.removeItem('user');
                                                            setAuth(null);
                                                        }}
                                                    >
                                                        Sign out
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className='bg-yellow-50 flex-grow flex h-[calc(100vh-56px)] overflow-y-auto'>
                    {/* FriendList */}
                    <div className='h-full w-[20%] text-black bg-[#272727]'>
                        <div className='flex flex-col h-full'>
                            <div className='flex mt-5 mb-2 gap-1 rounded px-2 py-2 mx-2 items-center justify-between bg-[#343434] border-b border-[#d7d7d7]'>
                                <input type="text" className='w-full text-[#d7d7d7] border-none outline-none bg-transparent text-xs' placeholder="Search for friends" />
                                <SearchIcon style={{ fontSize: "small", color: "white" }} />
                            </div>
                            <div className='flex-grow overflow-y-auto border-t-gray-300 p-2'>
                                {
                                    friends2 && friends2.map((friend: any, key: number) => {
                                        return (
                                            <div key={key} className='p-2 my-1 flex gap-3 items-center cursor-pointer hover:bg-[#404040] text-white rounded'
                                                onClick={() => {
                                                    setActiveFriend(friend);
                                                }}
                                                style={activeFriend?.id == friend.id ? { backgroundColor: "#404040" } : {}}
                                            >
                                                <div className='w-10 flex items-center justify-center h-10 overflow-hidden rounded-full bg-[#444]'>
                                                    {friend.profile ? <img src={friend?.profile} alt="" className='rounded-full' /> : <PersonIcon style={{ color: "#7d7d7d" }} />}
                                                </div>
                                                <div className='text-xs font-bold'>{friend.username}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div >
                                <div className='flex mb-5 mt-2 gap-1 rounded px-2 mx-2 items-center justify-between bg-[#343434] border-b border-[#d7d7d7]'>
                                    <input type="text" className='w-full text-[#d7d7d7] border-none outline-none bg-transparent text-xs' placeholder="Send invitation"
                                        value={targetmailaddress}
                                        onChange={(e: any) => {
                                            settargetmailaddress(e.target.value);
                                        }} />
                                    <IconButton style={{ fontSize: "small", color: "white" }} onClick={() => {
                                        if (targetmailaddress.length > 0) {
                                            sendfriendinvitation({
                                                targetmailaddress,
                                                token: auth.token
                                            })
                                        }
                                    }}>
                                        <SendIcon style={{ fontSize: "small" }} />
                                    </IconButton>
                                </div>
                                {/* <button onClick={() => {
                                    sendfriendinvitation({
                                        targetmailaddress,
                                        token: auth.token
                                    })
                                }}>send invitation</button> */}
                            </div>
                        </div>
                    </div>
                    {/* Messages */}
                    <div className='h-full w-[80%] text-black'>
                        <div className='flex flex-col h-full bg-[#272727] overflow-hidden'>
                            {
                                activeFriend !== null ?
                                    <>
                                        {/* Header */}
                                        <div className='flex text-[#d7d7d7] items-center justify-between w-full py-2 px-9 bg-[#272727]'>
                                            <div className='flex items-center gap-5'>
                                                <div className='w-10 h-10 overflow-hidden rounded-full'>
                                                    {activeFriend.profile ? <img src={activeFriend?.profile} alt="" width={'48'} height={'48'} className='rounded-full' /> : <PersonIcon />}
                                                </div>
                                                <div>
                                                    <p>{activeFriend?.username}</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-4 mr-3'>
                                                <button>
                                                    <IconButton style={{ color: "white" }}>
                                                        <CallIcon />
                                                    </IconButton>
                                                </button>
                                                <button>
                                                    <IconButton style={{ color: "white" }}>
                                                        <VideocamIcon />
                                                    </IconButton>
                                                </button>
                                            </div>
                                        </div>
                                        {/* Chat */}
                                        <div className='flex flex-col-reverse flex-grow py-4 overflow-y-auto' ref={chatContainerRef} style={{ backgroundImage: 'url("/backgroundimage.jpg")' }}>
                                            {
                                                messagesArray.length != 0 && messagesArray.map((message: any, key: any) => {
                                                    return (
                                                        <div key={key} className={`${message.authorId._id === activeFriend.id ? 'text-left' : 'text-right'} m-3`}>
                                                            {
                                                                key == 0 ?
                                                                    <motion.span
                                                                        className={`${message.authorId._id !== activeFriend.id ? 'bg-[#035d4d] text-[#ccdedb]' : 'bg-[#383838] text-[#d7d7d7]'} p-3  rounded-md text-xs`}
                                                                        animate={{ x: 5 }}
                                                                    >
                                                                        {message.content}
                                                                    </motion.span>
                                                                    :
                                                                    <span className={`${message.authorId._id !== activeFriend.id ? 'bg-[#035d4d] text-[#ccdedb]' : 'bg-[#383838] text-[#d7d7d7]'} p-3  rounded-md text-xs`}>{message.content}</span>

                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        {/* Send Message */}
                                        <div className='flex gap-4 items-center bg-[#272727]' style={{ padding: "4px 8px" }}>
                                            <div className='relative'>
                                                <button onClick={() => {
                                                    setIsOpenEmojiPicker(true);
                                                }}>
                                                    <SentimentSatisfiedAltIcon style={{ color: "white" }} />
                                                </button>
                                                <motion.div
                                                    id='emoji-picker'
                                                    ref={emojiPickerRef}
                                                    className='absolute'
                                                    initial={{ y: -40, opacity: 0, display: "none" }}
                                                    animate={isOpenEmojiPicker ? { y: -470, opacity: 1, display: "block" } : { y: -40, opacity: 0, display: "none" }}
                                                >
                                                    <Picker data={data} onEmojiSelect={(e: any) => {
                                                        setmessage((prevmessage: any) => {
                                                            return (
                                                                prevmessage + e.native
                                                            )
                                                        })
                                                    }} />
                                                </motion.div>
                                            </div>
                                            {/* <input type="text" id='sendMessageInput' className='flex-grow text-sm text-white bg-[#272727] border-none rounded outline-none' placeholder='Type a message' 
                                            
                                            value={message} 
                                            
                                            onChange={(e) => {
                                                setmessage(e.target.value)
                                            }}

                                                onKeyDown={(e: any) => {
                                                    if (e.key === "Enter" && e.ctrlKey) {
                                                        handlesendmessage();
                                                    }
                                                }}

                                            /> */}
                                            <div className='flex-grow h-full'>
                                                <Box
                                                    component="form"
                                                    noValidate
                                                    sx={{
                                                        '& .MuiTextField-root': { width: 'fullWidth', height: "full" },
                                                    }}
                                                >

                                                    <div>
                                                        <CssTextField
                                                            id="outlined-multiline-flexible"
                                                            multiline
                                                            fullWidth
                                                            autoFocus
                                                            spellCheck="false"
                                                            maxRows={4}
                                                            value={message}

                                                            onChange={(e) => {
                                                                setmessage(e.target.value)
                                                            }}

                                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                                if (e.key === "Enter" && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    handlesendmessage();
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </Box>
                                            </div>
                                            <button onClick={() => { handlesendmessage() }}>
                                                <IconButton style={{ color: "white", fontSize: "large" }}>
                                                    <SendIcon />
                                                </IconButton>
                                            </button>
                                        </div>
                                    </>
                                    : (
                                        <>
                                            <div className='h-full w-full flex flex-col p-3'>
                                                <div className='text-white'>Select some person to chat</div>
                                                <div className='flex-grow items-end justify-end flex'>
                                                    <Webrtc />
                                                </div>
                                            </div>
                                        </>
                                    )

                            }
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
