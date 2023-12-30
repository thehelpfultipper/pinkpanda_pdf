
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import s from './Popup.module.scss';

const PopupContent = ({ url, onClose }) => {
    const [zoom, setZoom] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clickThreshold, setClickThreshold] = useState(1);

    let initialX = useRef(0),
        initialY = useRef(0),
        currentX = useRef(0),
        currentY = useRef(0);

    let imgRef = useRef(null);

    const handleZoomToggle = (e) => {
        if (!isDragging && clickThreshold !== 0) {
            setZoom(!zoom);
            setPosition({ x: 0, y: 0 });
        } else {
            setClickThreshold(1);
        }
    }

    const handleStartDrag = (e) => {
        if (zoom) {
            setIsDragging(true);

            if (e.type === 'mousedown') {
                initialX.current = e.clientX;
                initialY.current = e.clientY;
            } else if (e.type === 'touchdown') {
                // Touch event (single touch for drag)
                initialX.current = e.touches[0].clientX;
                initialY.current = e.touches[0].clientY;
            }

            e.preventDefault();
        }
    };

    const handleEndDrag = () => {
        isDragging && setIsDragging(false);
    }

    const handleDrag = (e) => {
        if (!isDragging) return;

        let clientX, clientY;
        if (e.type === 'mousemove') {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            // Touch event (single touch for drag)
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // Ignore other cases
            return;
        }

        currentX.current = clientX;
        currentY.current = clientY;

        const deltaX = currentX.current - initialX.current;
        const deltaY = currentY.current - initialY.current;

        setPosition({ x: position.x + deltaX, y: position.y + deltaY });
        initialX.current = clientX;
        initialY.current = clientY;

    };

    const handleMouseMove = () => {
        if (isDragging) {
            setClickThreshold(0);
        }
    }

    const closePopupHandler = () => {
        onClose();
    }

    const imgStyle = {
        transform: `${zoom ? `translate(${position.x}px, ${position.y + 100}px)` : `translate(${position.x}px, ${position.y + 50}px)`} ${zoom ? 'scale(1.5)' : 'scale(1)'}`,
        cursor: zoom ? (isDragging ? 'move' : 'zoom-out') : 'zoom-in'
    };

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.addEventListener('touchstart', handleStartDrag, { passive: false });
            imgRef.current.addEventListener('touchend', handleEndDrag, { passive: false });
            imgRef.current.addEventListener('touchmove', handleDrag, { passive: false });
            imgRef.current.addEventListener('touchmovecapture', handleMouseMove, { passive: false });
        }
    }, []);

    return (
        <div className={s.popup}>
            <span className={s.close} onClick={closePopupHandler}>&times;</span>
            <img
                className={`${s.popup_content}`}
                style={imgStyle}
                src={url}
                alt="Expanded Image"
                onClick={handleZoomToggle}
                onMouseDown={handleStartDrag}
                onMouseUp={handleEndDrag}
                onMouseMove={handleDrag}
                onMouseMoveCapture={handleMouseMove}
                ref={imgRef}
            />
        </div>
    )
}

const Popup = ({ url, onClose }) => {
    return createPortal(
        <PopupContent url={url} onClose={onClose} />,
        document.getElementById('overlays')
    );
}


export default Popup;