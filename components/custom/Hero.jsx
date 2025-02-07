"use client"
import { MessagesContext } from '@/context/MessagesContext';
import React, { useContext, useState } from 'react'
import { Button } from '../ui/button';
import { UserDetailContext } from '@/context/UserDetailContext';
import SignInDialog from './SignInDialog';

const Hero = () => {
    const [userInput,setUserInput] = useState();
    const {messages,setMessages} = useContext(MessagesContext)
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const [openDialog,setOpenDialog] = useState(false);

    const onGenerate = (input) => {
        if(!userDetail?.name){
            setOpenDialog(true);
            return;
        }
        setMessages({
            role:'user',
            content:input
        })
    }
  return (<>
    <div>Hero</div>
    {userDetail?.name || 'Not logged in'} 
    <div>
    <textarea placeholder='write here' className='p-2 bg-red-200 ml-3' onChange={(e)=>setUserInput(e.target.value)}/>
    </div>
    {userInput}
    {messages?.role}
    {userInput && <Button onClick={()=>onGenerate(userInput)}>Generate</Button>}
    <SignInDialog openDialog={openDialog} closeDialog={()=>setOpenDialog(false)}/>
  </>
  )
}

export default Hero