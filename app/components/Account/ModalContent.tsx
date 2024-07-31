// 'use client';
import { Fragment } from 'react';

const ModalContent = ({ id, title, modalContent }: { id: string, title: string, modalContent: string }) => {
  // Convert newlines to an array of strings
  const lines = modalContent.split('\n');

  return (
    <div className='text-lg'>
      {/* The button to open the modal */}
      <label htmlFor={`my_modal_${id}`} className="btn">{title}</label>

      {/* Modal structure */}
      <input type="checkbox" id={`my_modal_${id}`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="py-4">
            {/* Render each line and include a <br /> for line breaks */}
            {lines.map((line, index) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </div>
          <div className="modal-action">
            <label htmlFor={`my_modal_${id}`} className="btn">Close!</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
