import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100'>
        <SignUp 
          signInUrl="/sign-in"
        />
    </main>
  )
}

export default SignUpPage