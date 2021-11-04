import clsx from 'clsx';
import cloneDeep from 'lodash.clonedeep';
import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { ReactComponent as BackspaceIcon } from '../../assets/icons/backspace-o.svg';
import { ReactComponent as SwapIcon } from '../../assets/icons/swap.svg';
import { drawWall } from '../Draw';
import { getViewBox, useGlobalContext } from '../GlobalContext';
import './Keyboard.css';
import { WallTypeSelector } from './WallTypeSelector';

type INumberButtonProps = {
    value: string;
};

type IKeyboardProps = {
    topText?: string;
    bottomText?: string;
    onSubmit?: (topText: string, bottomText: string) => void;
};

type IActionButtonProps = {
    value?: string;
    title?: string;
    icon?: React.ReactNode;
    className?: string;
    onClick: () => void;
};

const ActionButton: React.FC<IActionButtonProps> = ({ icon, title, value, className, onClick }) => (
    <button title={title} className={clsx('keyboard-button', className)} onClick={() => onClick()}>
        {icon ?? value}
    </button>
);

const Keyboard: React.FC<IKeyboardProps> = ({ topText, bottomText, onSubmit = () => {} }) => {
    const [selectedInput, setSelectedInput] = useState(!topText && bottomText ? 1 : 0);
    const [text1, setText1] = useState(topText ?? '');
    const [text2, setText2] = useState(bottomText ?? '');
    const setText = selectedInput === 0 ? setText1 : setText2;

    useEffect(() => {
        setText1(topText ?? '');
        setText2(bottomText ?? '');
    }, [topText, bottomText]);

    const handleSubmit = () => onSubmit(text1, text2);
    const handleBackspace = () => setText((prev) => prev.substring(0, prev.length - 1));

    const handleKeyDown: React.KeyboardEventHandler = (e) => {
        if ('0123456789'.includes(e.key)) {
            setText((prev) => prev + e.key);
        } else if (e.key === 'Backspace') {
            handleBackspace();
        } else if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const NumberButton: React.FC<INumberButtonProps> = ({ value }) => (
        <button
            title={value}
            className="keyboard-button"
            onClick={() => setText((prev) => prev + value)}
        >
            {value}
        </button>
    );

    return (
        <div>
            <table className="keyboard">
                <tbody>
                    <tr>
                        <td colSpan={2} className="keyboard-input-cell">
                            <div
                                tabIndex={0}
                                onKeyDown={handleKeyDown}
                                onClick={() => setSelectedInput(0)}
                                className={clsx(
                                    'keyboard-input',
                                    selectedInput === 0 && 'keyboard-active-input',
                                    !text1 && 'keyboard-empty-input',
                                )}
                            >
                                <span>{text1 || 'Top'}</span>
                            </div>
                        </td>
                        <td>
                            <ActionButton
                                title="Swap"
                                icon={<SwapIcon width={18} height={18} />}
                                onClick={() => {
                                    setText1(text2);
                                    setText2(text1);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={'keyboard-input-cell'}>
                            <div
                                tabIndex={0}
                                onKeyDown={handleKeyDown}
                                onClick={() => setSelectedInput(1)}
                                className={clsx(
                                    'keyboard-input',
                                    selectedInput === 1 && 'keyboard-active-input',
                                    !text2 && 'keyboard-empty-input',
                                )}
                            >
                                <span>{text2 || 'Bottom'}</span>
                            </div>
                        </td>
                        <td>
                            <ActionButton
                                title="Backspace"
                                icon={<BackspaceIcon width={16} height={16} />}
                                onClick={() => setText((p) => p.substring(0, p.length - 1))}
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
                            <ActionButton value="OK" onClick={handleSubmit} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export const MiniKeyboard: React.FC = () => {
    const { control, drawingRef, drawing, commandsHistory, setValue } = useGlobalContext();
    const selectedWall = useWatch({ control, name: 'selectedWall' });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });
    if (!selectedWall) {
        return null;
    }

    const viewBox = getViewBox(drawingRef);
    const cx = ((selectedWall.p1.x + selectedWall.p2.x) / 2 - viewBox.x) / scale;
    const cy = ((selectedWall.p1.y + selectedWall.p2.y) / 2 - viewBox.y) / scale;
    return (
        <div className="mini-keyboard" style={{ top: `${cy + 5}px`, left: `${cx + 5}px` }}>
            <WallTypeSelector
                wallType={selectedWall.type}
                variant={selectedWall.variant}
                onSubmit={(type, variant) => {
                    const wall = plan.walls.find((w) => w.id === selectedWall.id);
                    if (wall) {
                        wall.type = type;
                        wall.variant = variant;
                        commandsHistory.add({
                            tool: 'cursor',
                            data: {
                                before: [cloneDeep(selectedWall)],
                                after: [cloneDeep(wall)],
                            },
                        });
                        drawWall(drawing, wall);
                    }
                    setValue('selectedWall', { ...selectedWall, type, variant });
                }}
            />
            <Keyboard
                topText={selectedWall.topText}
                bottomText={selectedWall.bottomText}
                onSubmit={(topText, bottomText) => {
                    const wall = plan.walls.find((w) => w.id === selectedWall.id);
                    if (wall) {
                        wall.topText = topText;
                        wall.bottomText = bottomText;
                        commandsHistory.add({
                            tool: 'cursor',
                            data: {
                                before: [cloneDeep(selectedWall)],
                                after: [cloneDeep(wall)],
                            },
                        });
                        drawWall(drawing, wall);
                    }
                    setValue('selectedWall', undefined);
                }}
            />
        </div>
    );
};
