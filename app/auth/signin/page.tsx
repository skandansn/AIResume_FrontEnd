'use client'
import React from 'react'
import { useState } from 'react';

const SignInPage = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    async function signInHandler(event: React.FormEvent) {
        event.preventDefault()

        // console.log(email)
        // console.log(password)

        const response = await fetch('http://localhost:8000/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })

        // console.log(response.status)

        const data = await response.json()

        if (response.ok) {
            // console.log(data)

            // redirect to home page
            window.location.href = '/'
        } else {
            alert(data.detail)
            console.log(data.detail)
        }


    }

  return (
    <div className='h-screen flex items-center justify-center'>
        <form className='items-center justify-center flex flex-col space-y-3' onSubmit={signInHandler}>
            <div className='text-2xl font-bold'>Sign In</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Enter Email" className="input input-bordered w-full max-w-xs" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Enter Password" className="input input-bordered w-full max-w-xs" /> 
            <button type="submit" className="btn">Sign In</button>
            <text className='text-sm'>Do not have an account? <a href='/auth/register'>Register</a></text>
        </form>
     </div>
  )
}

export default SignInPage