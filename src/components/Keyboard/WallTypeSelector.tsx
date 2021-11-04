import clsx from 'clsx';
import React from 'react';
import { ReactComponent as DoorIcon } from '../../assets/icons/door.svg';
import { ReactComponent as RulerIcon } from '../../assets/icons/ruler.svg';
import { ReactComponent as WallIcon } from '../../assets/icons/wall.svg';
import { ReactComponent as WindowIcon } from '../../assets/icons/window.svg';
import { IWallType } from '../GlobalContext';
import './WallTypeSelector.css';

type IWallTypeSelectorProps = {
    wallType?: IWallType;
    variant?: string;
    onSubmit: (type: IWallType, variant?: string) => void;
};

export const WallTypeSelector: React.FC<IWallTypeSelectorProps> = ({
    wallType = 'wall',
    variant,
    onSubmit,
}) => {
    const WallButton: React.FC<{ type: IWallType; icon: React.ReactElement }> = ({
        type,
        icon,
    }) => (
        <button
            className={clsx('wall-type-button', wallType === type && 'wall-type-active-button')}
            onClick={() => {
                if (type === 'door' && wallType === 'door') {
                    const nextVariant = ((parseInt(variant ?? '1') || 1 + 1) % 4) + 1;
                    onSubmit(type, nextVariant.toString());
                } else {
                    onSubmit(type);
                }
            }}
        >
            {icon}
        </button>
    );
    return (
        <div className="wall-types-container">
            <WallButton type="wall" icon={<WallIcon width={18} height={18} />} />
            <WallButton type="window" icon={<WindowIcon width={14} height={14} />} />
            <WallButton type="door" icon={<DoorIcon width={18} height={18} />} />
            <WallButton type="ruler" icon={<RulerIcon width={16} height={16} />} />
        </div>
    );
};
