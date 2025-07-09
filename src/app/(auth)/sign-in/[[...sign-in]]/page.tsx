import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <SignIn 
          signUpUrl="/sign-up"
        />
    </main>
  )
}

export default SignInPage