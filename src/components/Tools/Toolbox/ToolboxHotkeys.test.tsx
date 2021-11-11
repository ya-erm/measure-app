import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { renderWithGlobalContext } from '../../GlobalContext.test';
import { ToolboxHotkeys, TOOL_HOTKEYS } from './ToolboxHotkeys';

test('Toolbox hotkeys should select tool', () => {
    const { getValues } = renderWithGlobalContext(<ToolboxHotkeys />);
    Object.entries(TOOL_HOTKEYS).forEach(([key, tool]) => {
        fireEvent.keyDown(document, { code: key });
        const selectedTool = getValues('settings.selectedTool');
        expect(selectedTool).toBe(tool);
    });
});

test('Hold space to temporary select move tool', () => {
    const { setValue, getValues } = renderWithGlobalContext(<ToolboxHotkeys />);
    act(() => setValue('settings.selectedTool', 'pencil'));
    // When press and hold Space key should be "move" tool
    fireEvent.keyDown(document, { code: 'Space' });
    let selectedTool = getValues('settings.selectedTool');
    expect(selectedTool).toBe('move');
    // When release Space key, selected tool should return to previous value
    fireEvent.keyUp(document, { code: 'Space' });
    selectedTool = getValues('settings.selectedTool');
    expect(selectedTool).toBe('pencil');
});
