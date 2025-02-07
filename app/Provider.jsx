"use client"
import { MessagesContext } from '@/context/MessagesContext'
import React, { useState } from 'react'

const provider = ({children}) => {
  const [messages,setMessages]=useState("");
  return (
    <MessagesContext.Provider value={{messages,setMessages}}>
    <div>{children}</div>
    </MessagesContext.Provider>
  )
}

export default provider