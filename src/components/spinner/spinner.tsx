import React from 'react';
import Lottie from 'lottie-react';
import animData from '../../assets/animations/peace1.json';

export const AnimalSpinner: React.FC = () => (
    <div
        role="status"
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(128, 128, 128, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(2px)',
        }}
    >
        <Lottie
            animationData={animData}
            loop
            style={{
                width: 300,
                height: 300,
            }}
        />
    </div>
);
