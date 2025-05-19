import React from 'react';
import '../../../css/components/landing/paquetes.css';

const PaqueteActualSkeleton = () => {
    return (
        <div className="actual-paquete actual-paquete-skeleton">
            <div className="skeleton-image"></div>
            <div className="paquete-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
};

export default PaqueteActualSkeleton;