import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { DrawPoint } from '../Draw';
import { IToolType, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

const tools: IToolType[] = ['pencil', 'eraser'];

export const PenTool: React.FC = () => {
    const { commandsHistory, interactiveRef, drawing, control, setValue } = useGlobalContext();
    const { stylusMode, magneticMode, selectedTool } = useWatch({ control, name: 'settings' });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });

    useEffect(() => {
        if (!interactiveRef.current || !tools.includes(selectedTool)) {
            return;
        }

        let points: DrawPoint[] = [];
        let id: string | undefined;

        const getStrokeOptions = () => {
            return {
                strokeWidth: scale * (selectedTool === 'eraser' ? 15 : 1.5),
                stroke: selectedTool === 'pencil' ? '#000' : '#fff',
            };
        };

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'stylus') return;
            if (e.type === 'touch' && e.touches!.length > 1) return;
            setValue('pointerDown', true);
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            points.push({ x, y, pressure: touch?.force });
            const { stroke, strokeWidth } = getStrokeOptions();
            id = drawing.drawPath({
                points,
                stroke,
                strokeWidth,
                groupId: 'pen',
            });
        };

        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'stylus') return;
            if (e.type === 'mouse' && !e.buttons) return;
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            points!.push({ x, y, pressure: touch?.force });
            const { strokeWidth } = getStrokeOptions();
            drawing.drawPath({ id, points, strokeWidth });
        };

        const onEnd = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'stylus') return;
            const strokeOptions = getStrokeOptions();
            const path = { id, points, ...strokeOptions, groupId: 'pen' };
            plan.notes.push(path);
            commandsHistory.add({
                tool: selectedTool as 'pencil' | 'eraser',
                data: { options: path },
            });
            id = undefined;
            points = [];
            if (!e.touches || e.touches?.length === 0) {
                setValue('pointerDown', false);
            }
        };

        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
    }, [
        scale,
        stylusMode,
        magneticMode,
        interactiveRef,
        commandsHistory,
        selectedTool,
        drawing,
        plan,
        setValue,
    ]);

    return null;
};
