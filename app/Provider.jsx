"use client"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState } from 'react'
import ConvexClientProvider from './ConvexClientProvider';

const provider = ({children}) => {
  const [messages,setMessages]=useState();
  const [userDetail,setUserDetail]=useState();
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY}>
      <ConvexClientProvider>

    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <MessagesContext.Provider value={{messages,setMessages}}>
    <div>{children}</div>
    </MessagesContext.Provider>
    </UserDetailContext.Provider>
      </ConvexClientProvider>
    </GoogleOAuthProvider>
  )
}

export default provider