'use client'
import React from 'react'
import { useState } from 'react'

const OutputResumeNameEditor = () => {

    const [outputResumeName, setOutputResumeName] = useState<string>('')

    async function outputResumeNameButtonHandler() {

        const response = await fetch('https://airesume-backend.onrender.com/account/updateOutputResumeName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "resume_name":outputResumeName }),
            credentials: 'include'
        })

        const data = await response.json()

        if (response.ok) {
            // console.log(data)
            // refresh the page
            window.location.href = '/profile'
        } else {
            alert(data.detail)
            console.log(data.detail)
        }


    }

  return (
    <div className='flex flow-row space-x-2'>
        <input type="text" placeholder="Set / Change Output Resume Name" value={outputResumeName} onChange={(e) => setOutputResumeName(e.target.value)} className="input input-bordered w-full max-w-xs" /> 
        <button onClick={outputResumeNameButtonHandler} className="btn">Set / Change Output Resume Name</button>
    </div>
 
)
}

export default OutputResumeNameEditor