"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/downloads/Lookup';
import axios from 'axios';
import { MessagesContext } from '@/context/MessagesContext';
import Prompt from '@/downloads/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';

const CodeView = () => {
  const [files,setFiles] = useState(Lookup?.DEFAULT_FILE)
  const {id} = useParams();
  const {messages,setMessages} = useContext(MessagesContext)
  const UpdateFiles = useMutation(api.workspace.UpdateFiles)
  const convex = useConvex();

  useEffect(() => {
    id && GetFiles();
  },[id])

  const GetFiles = async()=>{
    const result = await convex.query(api.workspace.GetWorkspace,{workspaceId:id})
    const mergedFiles = {...Lookup.DEFAULT_FILE,...result?.fileData}
    setFiles(mergedFiles)
  }
      useEffect(() => {
          if (messages?.length > 0) {
              const role = messages[messages.length - 1].role;
              if (role === 'user') {
                GenerateAiCode();
              }
          }
      }, [messages]);

  const GenerateAiCode = async ()=>{
    const PROMPT=JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT;
    const result = await axios.post('/api/gen-ai',{
      prompt:PROMPT
    })
    const aiResp = result.data;
    // console.log(result)
    const mergedFiles = {...Lookup.DEFAULT_FILE,...aiResp?.files}
    setFiles(mergedFiles)
    await UpdateFiles({workspaceId:id,files:aiResp?.files})
  }
 
  return (
    <>
      <SandpackProvider template="react"
      //the files has all the files that are to be shown in the code editor including tailwind css and others
      files={files}
      customSetup={{
        dependencies:{
          ...Lookup.DEPENDANCY
        },
      }}
      //To add tailwind css cdn functionality to the live code editor
      options={{
        externalResources:['https://unpkg.com/@tailwindcss/browser@4']
      }}
      >
    <SandpackLayout>
      <SandpackFileExplorer/>
      <SandpackCodeEditor />
      <SandpackPreview showNavigator={true}/>
    </SandpackLayout>
  </SandpackProvider>
    </>
  )
}

export default CodeView