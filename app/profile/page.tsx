import React from 'react'
import { cookies } from 'next/headers'
import { getCookie } from 'cookies-next'
import OutputResumeNameEditor from '../components/Account/OutputResumeNameEditor'
import ResumeContentEditor from '../components/Account/ResumeContentEditor'
import InputTexFilesEditor from '../components/Account/InputTexFilesEditor'
import ResumeContent from '../components/Account/ResumeContent'

const Profile = async () => {

    const authToken = getCookie('authToken', { cookies })
    
    console.log(authToken)

    if (!authToken) {
        // window.location.href = '/auth/signin'
    }

    const response = await fetch('https://airesume-backend.onrender.com/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
    })

    const data = await response.json()

    console.log(data)

    if (response.ok) {
        console.log("Profile data")
        console.log(data)
    } else {
        // console.log(data.detail)
    }






  return (
    <div className='flex flex-col space-y-3 justify-center items-center w-screen mt-3'>
        <div className='text-2xl font-bold'>Profile</div>
        <div className='text-lg'>Email: {data.email}</div>
        <div className='flex flex-row space-x-3'>
            {data.output_resume_name && <div className='text-lg'>Output Resume Name: {data.output_resume_name}</div>}
            <OutputResumeNameEditor />
        </div>
        <div className='flex flex-row space-x-3'>
        {data.resume_content && 
                <ResumeContent resumeContent={data.resume_content || ''} />
    }
        <ResumeContentEditor />
        </div>
        <div className='flex flex-col'>
            <div className='text-lg'>Input Resume template files</div>
        
        {/* for loop for tex_files */}
        {
            data.tex_files && data.tex_files.map((tex_file: string, index: number) => {
                return (
                    <div key={index} className='text-lg'>{index+1}: {tex_file}</div>
                )
            })
        
        }

        <InputTexFilesEditor />
        </div>
    </div>
  )
}

export default Profile