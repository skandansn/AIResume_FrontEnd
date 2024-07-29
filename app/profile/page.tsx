import React from 'react'
import { cookies } from 'next/headers'
import OutputResumeNameEditor from '../components/Account/OutputResumeNameEditor'
import ResumeContentEditor from '../components/Account/ResumeContentEditor'
import InputTexFilesEditor from '../components/Account/InputTexFilesEditor'
import ModalContent from '../components/Account/ModalContent'
import NavBar from '../components/NavBar'
import { text } from 'stream/consumers'

const Profile = async () => {

    const nextCookies = cookies()
    
    const authToken = nextCookies.get('authToken')

    if (!authToken) {
        window.location.href = '/auth/signin'
    }

    const response = await fetch('http://localhost:8000/account/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken?.value}`
        },
        credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
        if (data.tex_files?.length > 0) {
        let tex_file_names = []

        for (const tex of data.tex_files) {
            tex_file_names.push(tex.file_name)
        }

        data.tex_files = tex_file_names
    }

        data.resume_content = data?.resume?.content
        // console.log(data)
    } else {
        // console.log(data.detail)
    }






  return (
    <div>
    <NavBar/>
    <div className='flex flex-col space-y-3 justify-center items-center w-screen mt-3'>
        <div className='text-2xl font-bold'>Profile</div>
        <div className='text-lg'>Email: {data.email}</div>
        <div className='flex flex-row space-x-3'>
            {data.output_resume_name && <div className='text-lg'>Output Resume Name: {data.output_resume_name}</div>}
            <OutputResumeNameEditor />
        </div>
        <div className='flex flex-row space-x-3'>
        {data.resume_content && 
            <ModalContent id="resume" title='Resume Content' modalContent={data.resume_content} />
          }
        <ResumeContentEditor />
        </div>
        <div className='flex flex-row space-x-3'>

            {data.tex_files && <ModalContent id="tex_files" title="Input Resume Templates" modalContent={data.tex_files.join('\n')} />}
            
        <InputTexFilesEditor />
        </div>
    </div>
    </div>
  )
}

export default Profile