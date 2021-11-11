import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { IToolType } from '../../GlobalContext';
import { renderWithGlobalContext } from '../../GlobalContext.test';
import { ACTIVE_BUTTON_CLASS } from '../../RoundButton/RoundButton';
import { Toolbox } from './Toolbox';

export const TOOLS: IToolType[] = ['wall', 'destroy', 'cursor', 'pencil', 'eraser', 'move'];

function getButton(tool: IToolType) {
    return screen.getByTestId(`tool-${tool}`);
}

test('Every tool button is rendered', () => {
    renderWithGlobalContext(<Toolbox />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(TOOLS.length);
});

test('Every tool button has a title', () => {
    renderWithGlobalContext(<Toolbox />);
    TOOLS.forEach((tool) => {
        const button = getButton(tool);
        expect(button).toBeInTheDocument();
    });
});

test('Click to tool button should change selected tool', () => {
    const { getValues } = renderWithGlobalContext(<Toolbox />);
    TOOLS.forEach((tool) => {
        const button = getButton(tool);
        fireEvent.click(button);
        const selectedTool = getValues('settings.selectedTool');
        expect(selectedTool).toBe(tool);
    });
});

test('Selected tool should be rendered as active button', () => {
    const { setValue } = renderWithGlobalContext(<Toolbox />);
    TOOLS.forEach((tool) => {
        // Check that selected tool is active
        act(() => setValue('settings.selectedTool', tool));
        const button = getButton(tool);
        expect(button).toHaveClass(ACTIVE_BUTTON_CLASS);
        // Check that other buttons are not active
        const otherButtons = screen.getAllByRole('button').filter((x) => x !== button);
        otherButtons.forEach((button) => {
            expect(button).not.toHaveClass(ACTIVE_BUTTON_CLASS);
        });
    });
});
