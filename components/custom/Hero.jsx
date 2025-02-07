"use client"
import { MessagesContext } from '@/context/MessagesContext';
import React, { useContext, useState } from 'react'
import { Button } from '../ui/button';
import { UserDetailContext } from '@/context/UserDetailContext';
import SignInDialog from './SignInDialog';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

const Hero = () => {
    const [userInput,setUserInput] = useState();
    const {messages,setMessages} = useContext(MessagesContext)
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const CreateWorkspace=useMutation(api.workspace.CreateWorkspace);
    const [openDialog,setOpenDialog] = useState(false);
    const router = useRouter()

    const onGenerate =async (input) => {
        if(!userDetail?.name){
            setOpenDialog(true);
            return;
        }
        
        const msg={
          role:'user',
          content:input
        }
        setMessages(msg)

        const workspaceId = await CreateWorkspace({
          user:userDetail._id,
          messages:[msg],
        })
        router.push(`/workspace/${workspaceId}`);

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