import React, { useCallback, useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { ReactComponent as DestroyIcon } from '../../assets/icons/bulldozer.svg';
import { ReactComponent as CursorIcon } from '../../assets/icons/cursor.svg';
import { ReactComponent as EraserIcon } from '../../assets/icons/eraser.svg';
import { ReactComponent as MoveIcon } from '../../assets/icons/eye.svg';
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil.svg';
import { ReactComponent as WallIcon } from '../../assets/icons/wall.svg';
import { IToolType, useGlobalContext } from '../GlobalContext';
import { RoundButton } from '../RoundButton/RoundButton';
import './Toolbox.css';

type IToolboxProps = {};

export const Toolbox: React.FC<IToolboxProps> = () => {
    const { control, setValue } = useGlobalContext();
    const selectedTool = useWatch({ control, name: 'settings.selectedTool' });
    const [previousTool, setPreviousTool] = useState<IToolType>();

    const setSelectedTool = useCallback(
        (tool: IToolType) => {
            setValue('settings.selectedTool', tool);
        },
        [setValue],
    );

    type IToolVoxItemProps = {
        type: IToolType;
        name: string;
        icon?: JSX.Element;
    };
    const ToolBoxItem: React.FC<IToolVoxItemProps> = ({ type, name, icon }) => {
        return (
            <RoundButton
                title={name}
                active={selectedTool === type}
                onClick={() => setSelectedTool(type)}
            >
                {icon ?? name}
            </RoundButton>
        );
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW':
                    setSelectedTool('wall');
                    break;
                case 'KeyD':
                    setSelectedTool('destroy');
                    break;
                case 'KeyC':
                    setSelectedTool('cursor');
                    break;
                case 'KeyP':
                case 'KeyQ':
                    setSelectedTool('pencil');
                    break;
                case 'KeyE':
                    setSelectedTool('eraser');
                    break;
                case 'KeyM':
                    setSelectedTool('move');
                    break;
                case 'Space':
                    if (selectedTool !== 'move') {
                        setPreviousTool(selectedTool);
                        setSelectedTool('move');
                    }
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedTool, setSelectedTool]);

    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space' && previousTool) {
                setSelectedTool(previousTool);
            }
        };
        document.addEventListener('keyup', handleKeyUp);
        return () => document.removeEventListener('keyup', handleKeyUp);
    }, [previousTool, setSelectedTool]);

    return (
        <div className="toolboxContainer">
            <ToolBoxItem type="wall" name="Wall" icon={<WallIcon />} />
            <ToolBoxItem type="destroy" name="Destroy" icon={<DestroyIcon />} />
            <ToolBoxItem type="cursor" name="Cursor" icon={<CursorIcon />} />
            <ToolBoxItem type="pencil" name="Pencil" icon={<PencilIcon />} />
            <ToolBoxItem type="eraser" name="Eraser" icon={<EraserIcon />} />
            <ToolBoxItem type="move" name="Move" icon={<MoveIcon />} />
        </div>
    );
};
