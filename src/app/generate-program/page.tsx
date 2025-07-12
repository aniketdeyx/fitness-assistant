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
          <div className={`bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/80 transition-all duration-300 ${
            isSpeaking ? 'ring-2 ring-blue-500/50 bg-blue-900/20' : ''
          }`}>
            <div className="p-8 text-center">
              <div className="mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop&crop=face" 
                  alt="AI Fitness Coach" 
                  className={`w-24 h-24 rounded-full mx-auto object-cover border-4 transition-all duration-300 ${
                    isSpeaking ? 'border-blue-400 shadow-lg shadow-blue-500/30' : 'border-blue-600/50'
                  }`}
                />
                {/* Speaking animation */}
                {isSpeaking && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-blue-400/30 animate-pulse"></div>
                    <div className="absolute w-36 h-36 rounded-full border-2 border-blue-400/20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Brain className={`w-6 h-6 transition-colors duration-300 ${
                  isSpeaking ? 'text-blue-300' : 'text-blue-400'
                }`} />
                <h3 className="text-2xl font-semibold text-white">AI Fitness Coach</h3>
                {isSpeaking && (
                  <div className="flex space-x-1 ml-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
              </div>
              {/* Status indicator */}
              <div className="mb-4">
                {callActive && !isSpeaking && (
                  <p className="text-green-400 text-sm flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Listening...</span>
                  </p>
                )}
                {isSpeaking && (
                  <p className="text-blue-400 text-sm flex items-center justify-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-blue-400 rounded animate-pulse"></div>
                      <div className="w-1 h-6 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-5 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-7 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                      <div className="w-1 h-4 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <span>Speaking...</span>
                  </p>
                )}
                {!callActive && !connecting && (
                  <p className="text-gray-400 text-sm">Always ready to help</p>
                )}
                {connecting && (
                  <p className="text-yellow-400 text-sm flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </p>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your intelligent fitness companion providing personalized workout plans, 
                nutrition advice, and real-time form corrections powered by advanced AI 
                technology. Get expert guidance 24/7 to transform your fitness journey.
              </p>
            </div>
          </div>

          <div className={`bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/80 transition-all duration-300 ${
            callActive && !isSpeaking ? 'ring-2 ring-green-500/50 bg-green-900/10' : ''
          }`}>
            <div className="p-8 text-center">
              <div className="mb-6 relative">
                <div className={`w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto border-4 transition-all duration-300 ${
                  callActive && !isSpeaking ? 'border-green-400/70 shadow-lg shadow-green-500/20' : 'border-gray-500/50'
                }`}>
                  <User className="w-12 h-12 text-white" />
                </div>
                {/* User active indicator */}
                {callActive && !isSpeaking && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-green-400/30 animate-pulse"></div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <User className={`w-6 h-6 transition-colors duration-300 ${
                  callActive && !isSpeaking ? 'text-green-400' : 'text-gray-400'
                }`} />
                <h3 className="text-2xl font-semibold text-white">{user?.firstName || 'You'}</h3>
                {callActive && !isSpeaking && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
                )}
              </div>
              <div className="mb-4">
                {callActive && !isSpeaking && (
                  <p className="text-green-400 text-sm">Your turn to speak</p>
                )}
                {callActive && isSpeaking && (
                  <p className="text-gray-400 text-sm">Listening to AI...</p>
                )}
                {!callActive && (
                  <p className="text-gray-400 text-sm">Ready to transform</p>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">
                Share your fitness goals, track your progress, and get personalized guidance. 
                Your AI coach is here to support your journey every step of the way, 
                adapting to your needs and helping you achieve lasting results.
              </p>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {connecting && (
                <div className="flex items-center space-x-2 text-yellow-400">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-spin"></div>
                  <span className="font-medium">Connecting to AI Coach...</span>
                </div>
              )}
              {callActive && (
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Call Active</span>
                </div>
              )}
              {callEnded && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Session Complete - Redirecting...</span>
                </div>
              )}
            </div>

            <button
              onClick={toggleCall}
              disabled={connecting}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                callActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {connecting ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </span>
              ) : callActive ? 'End Call' : 'Start Call'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default GenerateProgramPage