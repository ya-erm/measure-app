import clsx from 'clsx';
import React from 'react';
import { useWatch } from 'react-hook-form';
import { ReactComponent as CursorIcon } from '../../assets/icons/cursor.svg';
import { ReactComponent as EraserIcon } from '../../assets/icons/eraser.svg';
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil.svg';
import { ReactComponent as WallIcon } from '../../assets/icons/wall.svg';
import { ReactComponent as DestroyIcon } from '../../assets/icons/bulldozer.svg';
import { IToolType, useGlobalContext } from '../GlobalContext';
import { RoundButton } from '../RoundButton/RoundButton';
import './Toolbox.css';

type IToolboxProps = {};

export const Toolbox: React.FC<IToolboxProps> = () => {
    const { control, setValue } = useGlobalContext();
    const selectedTool = useWatch({ control, name: 'settings.selectedTool' });

    const setSelectedTool = (tool: IToolType) => {
        setValue('settings.selectedTool', tool);
    };

    type IToolVoxItemProps = {
        type: IToolType;
        name: string;
        icon?: JSX.Element;
    };
    const ToolBoxItem: React.FC<IToolVoxItemProps> = ({ type, name, icon }) => {
        return (
            <RoundButton
                title={name}
                onClick={() => setSelectedTool(type)}
                className={clsx(selectedTool === type && 'toolboxSelectedItem')}
            >
                {icon ?? name}
            </RoundButton>
        );
    };

    return (
        <div className="toolboxContainer">
            <ToolBoxItem type="wall" name="Wall" icon={<WallIcon />} />
            <ToolBoxItem type="destroy" name="Destroy" icon={<DestroyIcon />} />
            <ToolBoxItem type="cursor" name="Cursor" icon={<CursorIcon />} />
            <ToolBoxItem type="pencil" name="Pencil" icon={<PencilIcon />} />
            <ToolBoxItem type="eraser" name="Eraser" icon={<EraserIcon />} />
        </div>
    );
};
