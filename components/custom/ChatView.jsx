"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { api } from '@/convex/_generated/api';
import Prompt from '@/downloads/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button';

const ChatView = () => {
    const [userInput,setUserInput] = useState();
    
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const [loading, setLoading] = useState(true); // ✅ Add loading state
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);

    useEffect(() => {
        if (id) {
            getWorkspaceData();
        }
    }, [id]);

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages]);

        const onGenerate=(input)=>{
            setMessages(prev=>[...prev,{
                role:'user',
                content:input
            }])
            setUserInput('')
        }

    const getWorkspaceData = async () => {
        try {
            setLoading(true); // ✅ Start loading
            const result = await convex.query(api.workspace.GetWorkspace, { workspaceId: id });
            setMessages(result?.messages ?? []); // ✅ Ensure it's always an array
            console.log("Workspace Data:", result);
        } catch (error) {
            console.error("Error fetching workspace data:", error);
            setMessages([]); // ✅ Prevent .map() errors
        } finally {
            setLoading(false); // ✅ Stop loading
        }
    };

    const GetAiResponse = async () => {
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', { prompt: PROMPT });
        console.log(result)
        setMessages(prev=>[...prev,{
            role:'ai',
            content:result.data.result
        }])
        await UpdateMessages({
            messages:[...messages,{
                role:'ai',
                content:result.data.result
            }],
            workspaceId:id
        })
    };

    return (
        <div className='bg-red-700'>
            <div>
                {loading ? ( // ✅ Show loading state while fetching data
                    <p>Loading...</p>
                ) : (
                    Array.isArray(messages) &&
                    messages.map((msg, index) => (
                        <div key={index}>
                            <h2>{msg.content}</h2>
                        </div>
                    ))
                )}
            </div>
            <div>
                {/* <div>{JSON.stringify(messages)}</div> */}

            </div>
            <textarea value={userInput} placeholder='write here' className='p-2 bg-red-200 ml-3' onChange={(e)=>setUserInput(e.target.value)}/>
                {userInput && <Button onClick={()=>onGenerate(userInput)}>Generate</Button>}
        </div>
    );
}

export default ChatView;
