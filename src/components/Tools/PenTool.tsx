import React, { useEffect } from 'react';
import { DrawPoint } from '../Draw';
import { IToolType, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

const tools: IToolType[] = ['pencil', 'eraser'];

export const PenTool: React.FC = () => {
    const { commandsHistory, drawing, interactiveRef, globalState, updateGlobalState } =
        useGlobalContext();
    const { scale, stylusMode, magneticMode, selectedTool } = globalState;

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
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) return;
            updateGlobalState({ pointerDown: true });
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            points.push({ x, y, pressure: touch?.force ?? 0.5 });
            const { stroke, strokeWidth } = getStrokeOptions();
            id = drawing.drawPath({
                points,
                stroke,
                strokeWidth,
                groupId: 'pen',
            });
        };

        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'mouse' && !e.buttons) return;
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            points!.push({ x, y, pressure: touch?.force ?? 0.5 });
            const { strokeWidth } = getStrokeOptions();
            drawing.drawPath({ id, points, strokeWidth });
        };

        const onEnd = (e: ToolEvent) => {
            const strokeOptions = getStrokeOptions();
            commandsHistory.add({
                tool: selectedTool as 'pencil' | 'eraser',
                data: { options: { id, points, ...strokeOptions, groupId: 'pen' } },
            });
            id = undefined;
            points = [];
            if (!e.touches || e.touches.length === 0) {
                updateGlobalState({ pointerDown: false });
            }
        };

        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactiveRef.current, scale, stylusMode, magneticMode, selectedTool]);

    return null;
};
