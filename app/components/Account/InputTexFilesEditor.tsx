'use client'
import React, { useState } from 'react'

const InputTexFilesEditor = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Handle file selection
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    // Handle button click
    async function inputTexFilesButtonHandler() {
        if (!selectedFile) {
            alert('No file selected or file is empty');
            return;
        }

        // console.log(selectedFile)

        const formData = new FormData();
        formData.append('input_tex', selectedFile);

        const response = await fetch('https://airesume-backend.onrender.com/account/updateInputTex', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            // console.log(data);
            window.location.href = '/profile'
        } else {
            alert(data.detail);
            console.log(data.detail);
        }
    }

    return (
        <div className='flex flow-row space-x-2'>
            <input 
                type="file" 
                className="file-input file-input-bordered w-full max-w-xs" 
                onChange={handleFileChange}
            />
            <button onClick={inputTexFilesButtonHandler} className="btn">
                Set / Change Input Tex Files
            </button>
        </div>
    );
}

export default InputTexFilesEditor;
