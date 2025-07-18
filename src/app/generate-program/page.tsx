"use client";

import { vapi } from '@/lib/vapi';
import { Brain, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {useEffect, useRef, useState} from 'react'
import { useUser } from '@clerk/nextjs';

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [program, setProgram] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
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
            full_name: fullName
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
                {/* <h3 className="text-2xl font-semibold text-white">{user?.firstName || 'You'}</h3> */}
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

        {/* Centered Call Button */}
        <div className="flex justify-center">
          <button
            onClick={toggleCall}
            disabled={connecting}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              callActive
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                : 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {connecting ? (
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : callActive ? (
              // End call icon (phone with x or hangup)
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.68.28-.26 0-.51-.1-.7-.28L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.7C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.68c.18.17.29.42.29.7 0 .28-.11.53-.29.7l-2.51 2.49c-.19.18-.44.28-.7.28-.25 0-.5-.1-.68-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
              </svg>
            ) : (
              // Dial-in icon (phone)
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            )}
          </button>
        </div>

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
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg min-h-[400px]">
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
                  <div key={index} className="message">
                    {/* Message content will be rendered here */}
                    <p className="text-gray-300">{message}</p>
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