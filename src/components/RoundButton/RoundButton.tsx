import clsx from 'clsx';
import React from 'react';
import './RoundButton.css';

type IRoundButtonProps = {
    icon?: JSX.Element;
    title?: string;
    active?: boolean;
    className?: string;
    onClick: () => void;
};

export const RoundButton: React.FC<IRoundButtonProps> = ({
    icon,
    title,
    active,
    className,
    children,
    onClick,
}) => {
    return (
        <div
            role="button"
            title={title}
            className={clsx('roundButton', active && 'roundButtonActive', className)}
            onClick={onClick}
        >
            {icon}
            {children}
        </div>
    );
};
