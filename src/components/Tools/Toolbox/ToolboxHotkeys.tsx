import React, { useEffect, useState } from 'react';
import { IToolType } from '../../GlobalContext';
import { useSelectedTool } from './useSelectedTool';

export const TOOL_HOTKEYS: { [key: string]: IToolType | undefined } = {
    keyW: 'wall',
    keyD: 'destroy',
    keyC: 'cursor',
    keyP: 'pencil',
    keyQ: 'pencil',
    keyE: 'eraser',
    KeyM: 'move',
};

export const ToolboxHotkeys: React.FC = () => {
    const [previousTool, setPreviousTool] = useState<IToolType>();
    const { selectedTool, setSelectedTool } = useSelectedTool();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const tool = TOOL_HOTKEYS[e.code];
            if (tool) {
                setSelectedTool(tool);
            }
            switch (e.code) {
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

    return null;
};
