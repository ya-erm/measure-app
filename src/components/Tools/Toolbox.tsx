import clsx from 'clsx';
import React from 'react';
import { ReactComponent as CursorIcon } from '../../assets/icons/cursor.svg';
import { ReactComponent as EraserIcon } from '../../assets/icons/eraser.svg';
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil.svg';
import { ReactComponent as WallIcon } from '../../assets/icons/wall.svg';
import { IToolType, useGlobalContext } from '../GlobalContext';
import './Toolbox.css';
import { RoundButton } from '../RoundButton/RoundButton';

type IToolboxProps = {};

export const Toolbox: React.FC<IToolboxProps> = () => {
    const {
        globalState: { selectedTool },
        updateGlobalState,
    } = useGlobalContext();

    const setSelectedTool = (tool: IToolType) => {
        updateGlobalState({ selectedTool: tool });
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
            <ToolBoxItem type="cursor" name="Cursor" icon={<CursorIcon />} />
            <ToolBoxItem type="pencil" name="Pencil" icon={<PencilIcon />} />
            <ToolBoxItem type="eraser" name="Eraser" icon={<EraserIcon />} />
        </div>
    );
};
