// 'use client'
import React, { useState, useEffect } from 'react'
// import { cookies } from 'next/headers'
import GenerateResumeButton from './GenerateResumeButton';

const InputReceiver = () => {

    const [resumeTemplates, setResumeTemplates] = useState<string[]>([])
    
    useEffect(() => {
        const fetchResumeTemplates = async () => {
            // const nextCookies = cookies()
    
            // const authToken = nextCookies.get('authToken')
    
            // if (!authToken) {
            //     window.location.href = '/auth/signin'
            // }
    
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/listTexFiles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${authToken?.value}`
                },
                credentials: 'include'
            })
    
            const responseJson = await response.json()
    
            if (response.ok) {
                
                let resumeTemplates: string[] = responseJson 
    
                
                if (resumeTemplates?.length > 0) {
                // console.log(resumeTemplates)
                let tex_file_names = []
    
                for (const tex of responseJson) {
                    tex_file_names.push(tex.file_name)
                }
    
                resumeTemplates = tex_file_names
            }
                // console.log(resumeTemplates)
                setResumeTemplates(resumeTemplates)
            } else {
                console.log(responseJson.detail)
            }
        }

        fetchResumeTemplates()
    }, [])



    // var resumeTemplates: string[] = []

    // const nextCookies = cookies()
    
    // const authToken = nextCookies.get('authToken')

    // if (!authToken) {
    //     window.location.href = '/auth/signin'
    // }

    // const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/listTexFiles', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${authToken?.value}`
    //     },
    //     credentials: 'include'
    // })

    // const responseJson = await response.json()

    // if (response.ok) {
        
    //     resumeTemplates = responseJson 

        
    //     if (resumeTemplates?.length > 0) {
    //     // console.log(resumeTemplates)
    //     let tex_file_names = []

    //     for (const tex of responseJson) {
    //         tex_file_names.push(tex.file_name)
    //     }

    //     resumeTemplates = tex_file_names
    // }
    //     // console.log(resumeTemplates)
    // } else {
    //     console.log(responseJson.detail)
    // }

    return (
        <div>
            <label className="form-control w-full max-w-xs pb-3">
                <div className="label">
                    <span className="label-text">Select your input resume template</span>
                </div>
                <select className="select select-bordered">
                    { resumeTemplates &&
                        resumeTemplates.map((resumeTemplate: string, index: number) => {
                            return (
                                <option key={index} value={resumeTemplate}>{resumeTemplate}</option>
                            )
                        })
                    }
                
                </select>
            
            </label>

            <div>
                <textarea id='job_description' className="textarea textarea-bordered" placeholder="Job Description"></textarea>
            </div>
            
            <div className="form-control">
                <label className="label cursor-pointer">
                    <span className="label-text">Optional AI Keywords</span>
                    <span className="label-text pl-3 pr-1">Yes </span>
                    <input value="true" type="radio" name="optional-keywords" className="radio checked:bg-blue-500" defaultChecked />
                    <span className="label-text pl-3 pr-1">No </span>
                    <input value="false" type="radio" name="optional-keywords" className="radio checked:bg-red-500"  />
                </label>
            </div>

            <div>
                <textarea id='mandatory_keywords' className="textarea textarea-bordered" placeholder="Enter the keywords that must be there in the updated resume if any"></textarea>
            </div>

            <div>
                <textarea id='ignore_keywords' className="textarea textarea-bordered" placeholder="Enter the keywords to ignore if any"></textarea>
            </div>

            <GenerateResumeButton />
        </div>
            
    
  )
}

export default InputReceiver