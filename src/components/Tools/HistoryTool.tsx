import React, { useEffect } from 'react';
import { distanceBetween } from '../Geometry';
import { Line, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const HistoryTool: React.FC = () => {
    const { commandsHistory, interactiveRef } = useGlobalContext();
    useEffect(() => {
        if (!interactiveRef.current) return;

        let lastEnd = 0;
        let lines: Line[] = [];

        const onStart = (e: ToolEvent) => {
            e.changedTouches?.forEach((touch) => {
                const x = touch.pageX;
                const y = touch.pageY;
                const id = touch.identifier.toString();
                if (!lines.find((l) => l.id === id)) {
                    lines.push({ id, p1: { x, y }, p2: { x, y } });
                }
            });
        };
        const onMove = (e: ToolEvent) => {
            e.changedTouches?.forEach((touch) => {
                const x = touch.pageX;
                const y = touch.pageY;
                const id = touch.identifier.toString();
                const line = lines.find((l) => l.id === id);
                if (line) {
                    line.p2.x = x;
                    line.p2.y = y;
                }
            });
        };
        const onEnd = (e: ToolEvent) => {
            const now = new Date().getTime();
            const timeDiff = now - lastEnd;
            lastEnd = now;
            if (!e.touches || e.touches?.length > 0) {
                return;
            }
            const notMoved = lines.filter((l) => distanceBetween(l.p1, l.p2) < 10).length;
            if (timeDiff < 500 && lines.length === 2 && notMoved === 2) {
                commandsHistory.undo();
            } else if (timeDiff < 500 && lines.length === 3 && notMoved === 3) {
                commandsHistory.redo();
            }
            lines = [];
        };
        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
    }, [commandsHistory, interactiveRef]);

    return null;
};
