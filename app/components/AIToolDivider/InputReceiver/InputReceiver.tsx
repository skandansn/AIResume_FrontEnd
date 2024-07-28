import React from 'react'
import { cookies } from 'next/headers'
import GenerateResumeButton from './GenerateResumeButton';

const InputReceiver = async () => {

    var resumeTemplates: string[] = []

    const nextCookies = cookies()
    
    const authToken = nextCookies.get('authToken')

    if (!authToken) {
        window.location.href = '/auth/signin'
    }

    const response = await fetch('http://localhost:8000/account/listTexFiles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken?.value}`
        },
        credentials: 'include'
    })

    const responseJson = await response.json()

    if (response.ok) {
        resumeTemplates = responseJson
        // console.log(resumeTemplates)
    } else {
        console.log(responseJson.detail)
    }

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