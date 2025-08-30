import React, { useState, useEffect } from 'react';
import '../styles/modal.css';

interface CustomModalProps {
    show: boolean;
    onHide: () => void;
    title: string;
    children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ show, onHide, title, children }) => {
    const [showModal, setShowModal] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (show) {
            setShowModal(false);
            requestAnimationFrame(() => {
                setShowModal(true);
            });
        } else {
            setClosing(true);
            setTimeout(() => {
                setShowModal(false);
                setClosing(false);
            }, 400);
        }
    }, [show]);

    const handleHide = () => {
        setClosing(true);
        setTimeout(() => {
            onHide();
            setClosing(false);
        }, 400);
    };

    return (
        <div className={`modal-overlay ${showModal ? 'show' : ''}`} onClick={handleHide}>
            <div
                className={`modal-container ${showModal ? 'show' : ''} ${closing ? 'hide' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal_header">
                    <span>{title}</span>
                    <button className="close_button" onClick={handleHide}>
                        &times;
                    </button>
                </div>
                <div className="modal_body">{children}</div>
            </div>
        </div>
    );
};

export { CustomModal };
