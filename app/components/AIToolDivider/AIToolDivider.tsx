import React from 'react'
import InputReceiver from './InputReceiver/InputReceiver'
import PDFViewer from './PDFViewer/PDFViewer'

const AIToolDivider = () => {
  return (
    <div className='mt-3'>
      <div id='resume_selector' className="flex w-full">
        <div className="card bg-base-300 rounded-box grid h-auto flex-grow place-items-center pb-3"><InputReceiver /></div>
        <div className="divider divider-horizontal"></div>
        <div className="card bg-base-300 rounded-box grid h-auto flex-grow place-items-center pt-3"><PDFViewer /></div>
      </div>
    </div>
  )
}

export default AIToolDivider