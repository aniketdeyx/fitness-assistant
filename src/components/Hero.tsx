import { ArrowRight, Zap } from 'lucide-react'
import React from 'react'

const Hero = () => {
  return (
    <div className='min-h-screen bg-gray-950 text-white'>
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center mb-6 bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Fitness Coach
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              Your Personal
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                AI Fitness Agent
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get personalized workout plans, nutrition advice, and real-time form corrections 
              powered by advanced AI technology. Transform your fitness journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 cursor-pointer rounded-2xl flex items-center hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-gray-600 cursor-pointer rounded-2xl border text-white hover:bg-gray-800 px-8 py-4 text-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero