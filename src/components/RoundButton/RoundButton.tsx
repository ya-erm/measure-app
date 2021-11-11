import clsx from 'clsx';
import React from 'react';
import './RoundButton.css';

export const ACTIVE_BUTTON_CLASS = 'roundButtonActive';

type IRoundButtonProps = {
    id?: string;
    icon?: JSX.Element;
    title?: string;
    active?: boolean;
    className?: string;
    onClick: () => void;
};

export const RoundButton: React.FC<IRoundButtonProps> = ({
    id,
    icon,
    title,
    active,
    className,
    children,
    onClick,
}) => {
    return (
        <div
            id={id}
            role="button"
            title={title}
            className={clsx('roundButton', active && ACTIVE_BUTTON_CLASS, className)}
            onClick={onClick}
            data-testid={id}
        >
            {icon}
            {children}
        </div>
    );
};
