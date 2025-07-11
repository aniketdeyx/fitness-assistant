"use client";

import { vapi } from '@/lib/vapi';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {useEffect, useRef, useState} from 'react'

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [program, setProgram] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const {user} = useUser();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages])

  //navigate to profile 
  useEffect(() => {
    if(callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500)
      return () => clearTimeout(redirectTimer);
    }
    
  }, [callEnded, router]);

  const toggleCall = async() => {
    if(callActive) {
      vapi.stop();
    }
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);
        const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "There";
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,

          }
        })

      } catch (error) {
        console.error("Error starting call:", error);
        setConnecting(false);
      }
    }
  }
  
  //event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };
    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setCallEnded(true);
      setConnecting(false);
      setIsSpeaking(false);
      
    };
    const handleSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };
    const handleSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };
    const handleMessage = () => {

    };
    const handleError = (error: Error) => {
      console.log("An error occurred", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);
    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
    }
  }, []);

  return (
    <main>
      
    </main>
  )
}

export default GenerateProgramPage