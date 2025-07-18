import React from 'react'

const CallButton = ({ toggleCall, connecting, callActive } : { toggleCall: () => void, connecting: boolean, callActive: boolean }) => {
  return (
            
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
  )
}

export default CallButton