'use client'
import React from 'react'
import { useState } from 'react'

const ResumeContentEditor = () => {

    const [resumeContent, setResumeContent] = useState<string>('')

    async function resumeContentEditorButtonHandler() {

        const response = await fetch('https://airesume-backend.onrender.com/account/updateResumeContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "resume_content":resumeContent }),
            credentials: 'include'
        })

        const data = await response.json()

        if (response.ok) {
            // console.log(data)
            window.location.href = '/profile'
        } else {
            alert(data.detail)
            console.log(data.detail)
        }


    }

  return (
    <div className='flex flow-row space-x-2'>
        <textarea value={resumeContent} onChange={(e) => setResumeContent(e.target.value)} className="textarea textarea-bordered" placeholder="Set / Change Resume Content"></textarea>
        <button onClick={resumeContentEditorButtonHandler} className="btn">Set / Change Resume Content</button>
    </div>
 
)
}

export default ResumeContentEditor