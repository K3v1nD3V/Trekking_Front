import React from 'react';
import Modal from './Modal';
import '../../css/common/ExpandedModal.css';

const ExpandedModal = ({ isOpen, onClose, mediaUrl, mediaType }) => {
  return (
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
  );
};

export default ExpandedModal;
