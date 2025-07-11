"use client";

import { vapi } from '@/lib/vapi';
import { useUser } from '@clerk/nextjs';
import { Brain, User } from 'lucide-react';
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
    <main className="min-h-screen bg-gray-950 pt-20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* AI and User Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/80 transition-all duration-300">
            <div className="p-8 text-center">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop&crop=face" 
                  alt="AI Fitness Coach" 
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-600/50"
                />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-semibold text-white">AI Fitness Coach</h3>
              </div>
              <p className="text-gray-400 mb-4">Always ready to help</p>
              <p className="text-gray-300 leading-relaxed">
                Your intelligent fitness companion providing personalized workout plans, 
                nutrition advice, and real-time form corrections powered by advanced AI 
                technology. Get expert guidance 24/7 to transform your fitness journey.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/80 transition-all duration-300">
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto border-4 border-gray-500/50">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <User className="w-6 h-6 text-gray-400" />
                <h3 className="text-2xl font-semibold text-white">You</h3>
              </div>
              <p className="text-gray-400 mb-4">Ready to transform</p>
              <p className="text-gray-300 leading-relaxed">
                Share your fitness goals, track your progress, and get personalized guidance. 
                Your AI coach is here to support your journey every step of the way, 
                adapting to your needs and helping you achieve lasting results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default GenerateProgramPage