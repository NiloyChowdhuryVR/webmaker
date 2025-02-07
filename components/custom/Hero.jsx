"use client"
import { MessagesContext } from '@/context/MessagesContext';
import React, { useContext, useState } from 'react'
import { Button } from '../ui/button';

const Hero = () => {
    const [userInput,setUserInput] = useState();
    const {messages,setMessages} = useContext(MessagesContext)

    const onGenerate = (input) => {
        setMessages({
            role:'user',
            content:input
        })
    }
  return (<>
    <div>Hero</div>
    <textarea placeholder='write here' className='p-2 bg-red-200' onChange={(e)=>setUserInput(e.target.value)}/>
    {userInput}
    {messages}
    {userInput && <Button onClick={()=>onGenerate(userInput)}>Generate</Button>}
  </>
  )
}

export default Hero