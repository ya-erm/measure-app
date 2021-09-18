import React, { useEffect } from 'react';
import { DrawPoint } from '../Draw';
import { IToolType, useGlobalContext } from '../GlobalContext';
import { drawHistory } from '../History/HistoryPanel';
import { registerTool, ToolEvent } from './ToolEvent';

const tools: IToolType[] = ['pencil', 'eraser'];

export const PenTool: React.FC = () => {
    const { drawing, interactiveRef, globalState, updateGlobalState } = useGlobalContext();
    const { scale, stylusMode, magneticMode, selectedTool } = globalState;

    useEffect(() => {
        if (!interactiveRef.current || !tools.includes(selectedTool)) {
            return;
        }

        let points: DrawPoint[] = [];
        let id: string | undefined;

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) return;
            updateGlobalState({ pointerDown: true });
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            points.push({ x, y, pressure: touch?.force ?? 0.5 });
            const strokeWidth = scale * (selectedTool === 'eraser' ? 15 : 1.5);
            if (selectedTool === 'pencil') {
                id = drawing.drawPath({
                    points,
                    stroke: '#000',
                    strokeWidth,
                    fill: 'none',
                    groupId: 'pen',
                });
                drawHistory.push({
                    tool: 'pencil',
                    data: id,
                });
            } else {
                id = drawing.drawPath({
                    points,
                    stroke: '#fff',
                    strokeWidth,
                    groupId: 'pen',
                });
                drawHistory.push({
                    tool: 'eraser',
                    data: id,
                });
            }
        };

        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'mouse' && !e.buttons) return;
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            points!.push({ x, y, pressure: touch?.force ?? 0.5 });
            const strokeWidth = scale * (selectedTool === 'eraser' ? 15 : 1.5);
            drawing.drawPath({ id, points, strokeWidth });
        };

        const onEnd = (e: ToolEvent) => {
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
