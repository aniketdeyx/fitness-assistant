import React from 'react'
import { Brain, User } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

const Card = ({isSpeaking, connecting, callActive}: {isSpeaking: boolean, connecting: boolean, callActive: boolean}) => {
    const user = useUser();
  return (
    <div>
        <div className="grid md:grid-cols-2 gap-6 mt-14">
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

            </div>
          </div>

          <div className={`bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/80 transition-all duration-300 ${
            callActive && !isSpeaking ? 'ring-2 ring-green-500/50 bg-green-900/10' : ''
          }`}>
            <div className="p-8 text-center">
              <div className="mb-6 relative">
                {user.user?.imageUrl ? (
                  <img 
                    src={user.user.imageUrl} 
                    alt="User Avatar" 
                    className={`w-24 h-24 rounded-full mx-auto object-cover border-4 transition-all duration-300 ${
                      callActive && !isSpeaking ? 'border-green-400/70 shadow-lg shadow-green-500/20' : 'border-gray-500/50'
                    }`}
                  />
                ) : (
                  <div className={`w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto border-4 transition-all duration-300 ${
                    callActive && !isSpeaking ? 'border-green-400/70 shadow-lg shadow-green-500/20' : 'border-gray-500/50'
                  }`}>
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
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

            </div>
          </div>
        </div>
    </div>
  )
}

export default Card