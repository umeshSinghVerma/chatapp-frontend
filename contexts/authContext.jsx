'use client'
import React,{useState,createContext, useEffect} from 'react'
export const AuthContext = createContext();

export default function AuthContextProvider({children}) {
  const [auth,setAuth] = useState(JSON.parse(localStorage.getItem('user'))||null);
  useEffect(()=>{
    localStorage.setItem('user',JSON.stringify(auth));
  },[auth])
  return (
    <AuthContext.Provider value={{auth,setAuth}}>
      {children}
    </AuthContext.Provider>
  )
}
