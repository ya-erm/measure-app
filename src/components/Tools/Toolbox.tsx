import clsx from 'clsx';
import React from 'react';
import { ReactComponent as CursorIcon } from '../../assets/icons/cursor.svg';
import { ReactComponent as EraserIcon } from '../../assets/icons/eraser.svg';
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil.svg';
import { ReactComponent as WallIcon } from '../../assets/icons/wall.svg';
import { ReactComponent as SaveIcon } from '../../assets/icons/save.svg';
// import { ReactComponent as MoveIcon } from '../../assets/icons/move.svg';
import { IToolType, useGlobalContext } from '../GlobalContext';
import './Toolbox.css';
import { saveSvg } from '../../utils/svg/save';

type IToolboxProps = {};

export const Toolbox: React.FC<IToolboxProps> = () => {
    const {
        drawingRef,
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
            <div
                onClick={() => setSelectedTool(type)}
                className={clsx('toolboxItem', selectedTool === type && 'toolboxSelectedItem')}
            >
                {icon ?? name}
            </div>
        );
    };

    return (
        <div className="toolboxContainer">
            <ToolBoxItem type="wall" name="Стена" icon={<WallIcon />} />
            <ToolBoxItem type="cursor" name="Курсор" icon={<CursorIcon />} />
            <ToolBoxItem type="pencil" name="Карандаш" icon={<PencilIcon />} />
            <ToolBoxItem type="eraser" name="Ластик" icon={<EraserIcon />} />
            <div className="toolboxItem" onClick={() => saveSvg(drawingRef.current!)}>
                <SaveIcon />
            </div>
        </div>
    );
};
