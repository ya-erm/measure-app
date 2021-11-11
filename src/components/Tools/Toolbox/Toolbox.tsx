import React from 'react';
import { ReactComponent as DestroyIcon } from '../../../assets/icons/bulldozer.svg';
import { ReactComponent as CursorIcon } from '../../../assets/icons/cursor.svg';
import { ReactComponent as EraserIcon } from '../../../assets/icons/eraser.svg';
import { ReactComponent as MoveIcon } from '../../../assets/icons/eye.svg';
import { ReactComponent as PencilIcon } from '../../../assets/icons/pencil.svg';
import { ReactComponent as WallIcon } from '../../../assets/icons/wall.svg';
import { IToolType } from '../../GlobalContext';
import { RoundButton } from '../../RoundButton/RoundButton';
import './Toolbox.css';
import { ToolboxHotkeys } from './ToolboxHotkeys';
import { useSelectedTool } from './useSelectedTool';

export const Toolbox: React.FC = () => {
    const { selectedTool, setSelectedTool } = useSelectedTool();

    type IToolVoxItemProps = {
        type: IToolType;
        name: string;
        icon?: JSX.Element;
    };

    const ToolBoxItem: React.FC<IToolVoxItemProps> = ({ type, name, icon }) => {
        return (
            <RoundButton
                title={name}
                id={`tool-${type}`}
                active={selectedTool === type}
                onClick={() => setSelectedTool(type)}
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
            <ToolBoxItem type="move" name="Move" icon={<MoveIcon />} />
            <ToolboxHotkeys />
        </div>
    );
};
