"use client"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react'
import ConvexClientProvider from './ConvexClientProvider';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';

const provider = ({children}) => {
  const [messages,setMessages]=useState();
  const [userDetail,setUserDetail]=useState();

  const convex = useConvex();
  useEffect(() => {
    isAuthenticated();
  },[])

  const isAuthenticated=async()=>{
    if(typeof window !== 'undefined'){
      const user=JSON.parse(localStorage.getItem('user'));
      if(!user){
        return;
      }
      const result = await convex.query(api.users.GetUser,{email:user?.email});
      if(!result){
        return;
      }
      setUserDetail(result);
      console.log(result)
      //fetch user from db

    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY}>
      {/* <ConvexClientProvider> */}

    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <MessagesContext.Provider value={{messages,setMessages}}>
    <div>{children}</div>
    </MessagesContext.Provider>
    </UserDetailContext.Provider>
      {/* </ConvexClientProvider> */}
    </GoogleOAuthProvider>
  )
}

export default provider