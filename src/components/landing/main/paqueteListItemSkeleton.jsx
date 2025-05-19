import React from 'react';
import '../../../css/components/landing/paquetes.css';


const PaqueteListItemSkeleton = () => {
    return (
        <div className="paquete-item">
            <div className="skeleton-image"></div>
            <div className="paquete-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
};

export default PaqueteListItemSkeleton;