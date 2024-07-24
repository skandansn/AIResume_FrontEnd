'use client';

import React, { useState } from 'react';

const GenerateResumeButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateResumeButtonHandler = async () => {
        setIsLoading(true); // Start loading

        let job_description = (document.getElementById('job_description') as HTMLTextAreaElement).value;
        let mandatory_keywords = (document.getElementById('mandatory_keywords') as HTMLTextAreaElement).value;
        let ignore_keywords = (document.getElementById('ignore_keywords') as HTMLTextAreaElement).value;
        let optional_keywords = (document.querySelector('input[name="optional-keywords"]:checked') as HTMLInputElement).value;
        let resume_template = (document.querySelector('select') as HTMLSelectElement).value;
        resume_template = resume_template.slice(0, -4);

        let keywords = {
            mandatory_keywords: mandatory_keywords,
            ignore_keywords: ignore_keywords,
            optional_keywords: optional_keywords
        };

        const response = await fetch('https://airesume-backend.onrender.com/keywordsInjections/jobDescription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: job_description, keywords: keywords, resume_name: resume_template }),
            credentials: 'include'
        });

        const data = await response.json();
        // console.log(data);

        // window.open(data['resume_url']); // Open the resume URL

        if (response.ok) {
            setIsLoading(false); // Stop loading
        } else {
            alert(data.detail);
            console.log(data.detail);
            setIsLoading(false); // Stop loading
        }

    };

    return (
        <div>
            {isLoading ? (
                <span className="loading loading-dots loading-lg"></span>
            ) : (
                <button onClick={generateResumeButtonHandler} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">
                    Generate AI Matched Resume
                </button>
            )}
        </div>
    );
};

export default GenerateResumeButton;
