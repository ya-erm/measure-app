import React, { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { drawWall } from '../Draw';
import { useGlobalContext } from '../GlobalContext';
import './Keyboard.css';

type INumberButtonProps = {
    value: string;
    onClick?: () => void;
};

type IKeyboardProps = {
    value?: string;
    onSubmit?: (value: string) => void;
};

const Keyboard: React.FC<IKeyboardProps> = ({ value, onSubmit = () => {} }) => {
    const [text, setText] = useState(value ?? '');

    const NumberButton: React.FC<INumberButtonProps> = ({ value, onClick }) => (
        <button
            className="keyboard-button"
            onClick={() => (onClick ? onClick() : setText((prev) => prev + value))}
        >
            {value}
        </button>
    );

    return (
        <div>
            <table className="keyboard">
                <tbody>
                    <tr>
                        <td colSpan={2}>
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="keyboard-input"
                            />
                        </td>
                        <td>
                            <NumberButton
                                value="<"
                                onClick={() =>
                                    setText((prev) => prev.substring(0, prev.length - 1))
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <NumberButton value="7" />
                        </td>
                        <td>
                            <NumberButton value="8" />
                        </td>
                        <td>
                            <NumberButton value="9" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <NumberButton value="4" />
                        </td>
                        <td>
                            <NumberButton value="5" />
                        </td>
                        <td>
                            <NumberButton value="6" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <NumberButton value="1" />
                        </td>
                        <td>
                            <NumberButton value="2" />
                        </td>
                        <td>
                            <NumberButton value="3" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <NumberButton value="0" />
                        </td>
                        <td className="keyboard-submit">
                            <NumberButton value="OK" onClick={() => onSubmit(text)} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export const MiniKeyboard: React.FC = () => {
    const { control, drawing, commandsHistory, setValue } = useGlobalContext();
    const selectedWall = useWatch({ control, name: 'selectedWall' });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });
    if (!selectedWall) {
        return null;
    }

    const cx = (selectedWall.p1.x + selectedWall.p2.x) / 2 / scale;
    const cy = (selectedWall.p1.y + selectedWall.p2.y) / 2 / scale;
    return (
        <div className="mini-keyboard" style={{ top: `${cy + 5}px`, left: `${cx + 5}px` }}>
            <Keyboard
                value={selectedWall.length}
                onSubmit={(v) => {
                    const wall = plan.walls.find((w) => w.id === selectedWall.id);
                    if (wall) {
                        commandsHistory.add({
                            tool: 'text',
                            data: {
                                id: wall.id,
                                before: wall.length,
                                after: v,
                            },
                        });
                        wall.length = v;
                        drawWall(drawing, wall);
                    }
                    setValue('selectedWall', undefined);
                }}
            />
        </div>
    );
};
