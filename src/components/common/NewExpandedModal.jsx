import React from 'react';
import Modal from './Modal';
import ModalPortal from './ModalPortal';
import '../../css/common/NewExpandedModal.css';

const NewExpandedModal = ({ isOpen, onClose, mediaUrl, mediaType }) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        closeOnOverlayClick={true}
        showCloseButton={true}
        className="expanded-modal-wrapper"
      >
        <div className="expanded-modal-content">
          {mediaType === 'video' ? (
            <video 
              controls 
              autoPlay 
              src={mediaUrl} 
              className="expanded-modal-media"
            />
          ) : (
            <img 
              src={mediaUrl} 
              alt="Expanded media" 
              className="expanded-modal-media"
            />
          )}
        </div>
      </Modal>
    </ModalPortal>
  );
};

export default NewExpandedModal;
