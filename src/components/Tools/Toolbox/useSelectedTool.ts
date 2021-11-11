import { useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import { IToolType, useGlobalContext } from '../../GlobalContext';

export function useSelectedTool() {
    const { control, setValue } = useGlobalContext();
    const selectedTool = useWatch({ control, name: 'settings.selectedTool' });

    const setSelectedTool = useCallback(
        (tool: IToolType) => {
            setValue('settings.selectedTool', tool);
        },
        [setValue],
    );

    return { selectedTool, setSelectedTool };
}
