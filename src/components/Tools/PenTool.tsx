import React, { useEffect } from 'react';
import { DrawPoint } from '../Draw';
import { IToolType, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

const tools: IToolType[] = ['pencil', 'eraser'];

export const PenTool: React.FC = () => {
    const { drawing, interactiveRef, globalState, updateGlobalState } = useGlobalContext();
    const { scale, stylusMode, magneticMode, selectedTool } = globalState;

    useEffect(() => {
        if (!interactiveRef.current || !tools.includes(selectedTool)) {
            return;
        }

        let lineWidth = 1;
        let points: DrawPoint[] = [];
        let id: string | undefined;

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) return;
            updateGlobalState({ pointerDown: true });
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            lineWidth = Math.log((touch?.force || 0.1) + 1) * 10;
            if (selectedTool === 'pencil') {
                points.push({ x, y, lineWidth });
                id = drawing.drawPath({
                    points,
                    stroke: '#000',
                    strokeWidth: lineWidth,
                    fill: 'none',
                    groupId: 'pen',
                });
            } else {
                id = drawing.drawPath({
                    points,
                    stroke: '#000',
                    strokeLinecap: 'round',
                    strokeWidth: lineWidth * 20,
                    fill: 'none',
                    groupId: 'eraser',
                });
            }
        };

        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'mouse' && !e.buttons) return;
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            lineWidth = Math.log((touch?.force || 0.1) + 1) * 40 * 0.2 + (lineWidth ?? 1) * 0.8;
            points!.push({ x, y, lineWidth });
            drawing.drawPath({ id, points });
        };

        const onEnd = (e: ToolEvent) => {
            points = [];
            lineWidth = 0;
            if (!e.touches || e.touches.length === 0) {
                updateGlobalState({ pointerDown: false });
            }
        };

        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactiveRef.current, scale, stylusMode, magneticMode, selectedTool]);

    return null;
};
