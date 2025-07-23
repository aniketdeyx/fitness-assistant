"use client";

import { vapi } from '@/lib/vapi';
import { useRouter } from 'next/navigation';
import {useEffect, useRef, useState} from 'react'
import { useUser } from '@clerk/nextjs';
import CallButton from '@/components/CallButton';
import Card from '@/components/Card';

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const router = useRouter();
  const { user } = useUser();
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
        await vapi.start(undefined, undefined, undefined, process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            user_id: user?.id
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
    const handleMessage = (message: any) => {
      if(message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage])
      }
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
    <main className="min-h-screen bg-gray-950 pt-20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card isSpeaking={isSpeaking} connecting={connecting} callActive={callActive}/>

        {/* Centered Call Button */}
                <CallButton toggleCall={toggleCall} connecting={connecting} callActive={callActive}/>

        {/* Status Display */}
        <div className="flex justify-center">
          {connecting && (
            <div className="flex items-center space-x-2 text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Connecting to AI Coach...</span>
            </div>
          )}
          {callActive && (
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Call Active</span>
            </div>
          )}
          {callEnded && (
            <div className="flex items-center space-x-2 text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Session Complete - Redirecting...</span>
            </div>
          )}
        </div>

        {/* Conversation Container */}
        <div className="bg-gray-800/30 border mb-10 border-gray-700 rounded-lg min-h-[400px]">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
              Conversation
            </h3>
            <div 
              ref={messageContainerRef}
              className="max-h-80 overflow-y-auto space-y-3"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>Start a call to begin your conversation with the AI Coach</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.role === 'user' ? 'You' : 'AI Coach'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default GenerateProgramPage