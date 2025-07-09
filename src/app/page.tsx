
import { SignedIn, SignInButton, SignOutButton, SignedOut} from '@clerk/nextjs'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <SignedIn>
      <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  )
}

export default HomePage