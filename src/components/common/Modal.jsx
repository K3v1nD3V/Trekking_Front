import React from 'react';
import '../../css/common/Modal.css';

const Modal = ({ isOpen, onClose, children, closeButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {closeButton && (
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        )}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
