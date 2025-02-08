import { GenAiSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req){
    const {prompt} = await req.json();

    try {
        const result = await GenAiSession.sendMessage(prompt);
        const resp = await result.response.text();
        //the resp is a markdown formatted file with ```json at the start and ``` at the end so we need to remove them to get the json response so the below code does that
        const cleanedCode = resp.replace(/```json|```/g, ''); // Remove ```json and ```
    //   console.log(cleanedCode);
        // console.log("RAW RESPONSE",resp)
        return NextResponse.json(JSON.parse(cleanedCode));
    } catch (error) {
        return NextResponse.json({error:error.message})
    }

}