import clsx from 'clsx';
import React from 'react';
import './RoundButton.css';

type IRoundButtonProps = {
    icon?: JSX.Element;
    title?: string;
    className?: string;
    onClick: () => void;
};

export const RoundButton: React.FC<IRoundButtonProps> = ({
    icon,
    title,
    className,
    children,
    onClick,
}) => {
    return (
        <div title={title} className={clsx('roundButton', className)} onClick={onClick}>
            {icon}
            {children}
        </div>
    );
};
