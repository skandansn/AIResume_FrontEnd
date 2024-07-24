import React from 'react';

const ResumeContent = ({ resumeContent }: { resumeContent: string }) => {
  // Convert newlines to an array of strings
  const lines = resumeContent.split('\n');

  return (
    <div className='text-lg'>
      {/* The button to open the modal */}
      <label htmlFor="my_modal_6" className="btn">Resume Content</label>

      {/* Modal structure */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Your Resume Content</h3>
          <div className="py-4">
            {/* Render each line and include a <br /> for line breaks */}
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className="modal-action">
            <label htmlFor="my_modal_6" className="btn">Close!</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeContent;
