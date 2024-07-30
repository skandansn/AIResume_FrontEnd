'use client'
import React from 'react'
import { useState } from 'react';

const SignInPage = () => {

    const [email, setEmail] = useState<string>('')
    const [password1, setPassword1] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')


    async function registerHandler(event: React.FormEvent) {
        event.preventDefault()

        // console.log(email)
        // console.log(password1)
        // console.log(password2)

        if (password1 !== password2) {
            alert('Passwords do not match')
            return
        }

        const response = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password: password1 }),
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
        <form className='items-center justify-center flex flex-col space-y-3' onSubmit={registerHandler}>
            <div className='text-2xl font-bold'>Register</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Enter Email" className="input input-bordered w-full max-w-xs" />
            <input value={password1} onChange={(e) => setPassword1(e.target.value)} required type="password" placeholder="Enter Password" className="input input-bordered w-full max-w-xs" /> 
            <input value={password2} onChange={(e) => setPassword2(e.target.value)} required type="password" placeholder="Enter Password" className="input input-bordered w-full max-w-xs" /> 
            <button type="submit" className="btn">Register</button>
            <text className='text-sm'>Already have an account? <a href='/auth/signin'>Sign In</a></text>
        </form>
     </div>
  )
}

export default SignInPage