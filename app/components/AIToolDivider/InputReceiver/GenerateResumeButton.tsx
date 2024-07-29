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
        resume_template = resume_template;

        let keywords = {
            mandatory_keywords: mandatory_keywords,
            ignore_keywords: ignore_keywords,
            optional_keywords: optional_keywords
        };

        if (ignore_keywords === '') {
            if (keywords.hasOwnProperty('ignore_keywords')) {
                delete (keywords as { ignore_keywords?: string }).ignore_keywords;
            }
        }
        if (mandatory_keywords === '') {
            if (keywords.hasOwnProperty('mandatory_keywords')) {
                delete (keywords as { mandatory_keywords?: string }).mandatory_keywords;
            }
        }
       
        const response = await fetch('http://localhost:8000/keywordsInjections/jobDescription', {
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

            if (response.status === 401) {
                // redirect to home page
                window.location.href = '/auth/signin';
            } else {
            console.log(data.detail);
            setIsLoading(false); // Stop loading
            }
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
