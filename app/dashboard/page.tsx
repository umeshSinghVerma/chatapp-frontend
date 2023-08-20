'use client'
import { useRouter } from 'next/navigation';
import React, { useContext, useReducer, useEffect } from 'react'
import io from "socket.io-client";
import Snackbar from '@mui/material/Snackbar'
// import {reducer,initialstate} from '../reducers/reducers'
import { AuthContext } from '@/contexts/authContext';
// import Connectwithsocketserver from '../realtimeconnection/socketconnection'
// import connect

export default function Page() {
    const { auth, setAuth } = useContext(AuthContext);
    // const [state, dispatch] = useReducer(reducer, initialstate);
    const router = useRouter();
    if (auth == null) {
        router.push('/login');
        return null;
    }
    function Connectwithsocketserver() {

        let socket = io("http://localhost:5002", {
            auth: {
                token: auth.token
            }
        });
        socket.on("connect", () => {
            console.log("successfully connected to the server");
            console.log(socket.id);
        });

    }
    //destructure from reducer.js
    // const { counter, isLoading, data } = state;

    // Functions to dispatch actions
    // const increment = () => dispatch({ type: 'INCREMENT' });
    // const decrement = () => dispatch({ type: 'DECREMENT' });
    // const setLoading = (value) => dispatch({ type: 'SET_LOADING', payload: value });
    // const setData = (data) => dispatch({ type: 'SET_DATA', payload: data });




    // useEffect(() => {
    //     Connectwithsocketserver();
    //     //very important to add cleanup function
    //     // return (

    //     // )
    // }, [])
    return (
        <div>
            {auth && <>
                <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
                                        src="ourwebsitelogo"
                                        className="h-8 mr-3"
                                        alt="ourwebsitelogo"
                                    />
                                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                        ourwebsitename
                                    </span>
                                </a>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center ml-3 relative">
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
                                        className="z-50 hidden  my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-5 right-0"
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
                                                {auth.email}
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
                </nav>
                <aside
                    id="logo-sidebar"
                    className="fixed top-0 left-0 z-40 w-30 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
                    aria-label="Sidebar"
                >
                    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">

                            <li>
                                <a
                                    href="#"
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <svg
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 18"
                                    >
                                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
                                </a>
                            </li>


                        </ul>
                    </div>
                </aside>

                <div className="p-4 ">

                </div>
            </>}
        </div>
    )
}
