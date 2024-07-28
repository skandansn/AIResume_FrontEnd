'use client'
import React from 'react'
import { pdfjs } from 'react-pdf';
import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

const PDFViewer = () => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [resumeLink, setResumeLink] = useState<string | null>(null);

    function pageNumberHandler(pageNumber: number) {
        if (pageNumber < 1) {
            setPageNumber(1)
        } else if (pageNumber > numPages) {
            setPageNumber(numPages)
        } else {
            setPageNumber(pageNumber)
        }
    }

    async function resumeLoader() {

        const response = await fetch('http://localhost:8000/account/outputResumeLink', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        const data = await response.json()

        if (response.ok) {
            // console.log(data)
            setResumeLink(data)
            setRefreshKey(refreshKey + 1)
        } else {
            alert(data.detail)
            console.log(data.detail)
        }
    
    }

    function resumeDownloader() {
        let downloadLink = resumeLink

        if (downloadLink) {
            window.open(downloadLink, '_blank')
        } else {
            alert('Resume not loaded yet')
        }

    }

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div>
          <button className='p-2 m-2 btn' onClick={resumeLoader}>Fetch Latest Updated Resume</button>
          <button className='p-2 m-2 btn' onClick={resumeDownloader}>Download Resume</button>
            {resumeLink && (
                <div>
                    <Document
                        file={resumeLink}
                        onLoadSuccess={onDocumentLoadSuccess}
                        key={refreshKey} // Use key to force re-render
                    >
                        <Page
                            renderTextLayer={false}
                            pageNumber={pageNumber}
                        />
                    </Document>
                    <p>
                        Page {pageNumber} of {numPages}
                    </p>
                    <button className='p-2 m-2 btn' onClick={() => pageNumberHandler(pageNumber - 1)}>Previous</button>
                    <button className='p-2 btn' onClick={() => pageNumberHandler(pageNumber + 1)}>Next</button>
                </div>
            )}
        </div>
      );
}

export default PDFViewer