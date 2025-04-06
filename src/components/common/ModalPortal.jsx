import React from 'react';
import ReactDOM from 'react-dom';

const ModalPortal = ({ children }) => {
  const modalRoot = document.getElementById('modal-root');
  
  if (!modalRoot) {
    const newRoot = document.createElement('div');
    newRoot.id = 'modal-root';
    document.body.appendChild(newRoot);
  }

  return ReactDOM.createPortal(children, modalRoot || document.getElementById('modal-root'));
};

export default ModalPortal;
