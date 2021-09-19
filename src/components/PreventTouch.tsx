import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useGlobalContext } from './GlobalContext';

const PreventTouch: React.FC = () => {
    const { control } = useGlobalContext();

    const pointerDown = useWatch({ control, name: 'pointerDown' });

    useEffect(() => {
        const onTouchMove = (e: TouchEvent) => {
            if (pointerDown) {
                e.preventDefault();
            }
        };
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => {
            document.removeEventListener('touchmove', onTouchMove);
        };
    }, [pointerDown]);

    return null;
};

export default PreventTouch;
