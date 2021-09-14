import React, { useEffect, useRef } from 'react';
import { clearCircle, DrawPoint, drawStroke } from '../Draw';
import { useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const PenTool: React.FC = () => {
    const { globalState, updateGlobalState } = useGlobalContext();
    const { scale, canvas, context, stylusMode, magneticMode, selectedTool } = globalState;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // TODO: on resize
    const width = window.innerWidth * scale;
    const height = window.innerHeight * scale;

    useEffect(() => {
        canvasRef.current!.width = width;
        canvasRef.current!.height = height;
    }, []);

    useEffect(() => {
        if (!canvas || (selectedTool !== 'pen' && selectedTool !== 'eraser')) {
            return;
        }

        let lineWidth = 0;
        let points: DrawPoint[] = [];

        const ctx = canvasRef.current!.getContext('2d')!;

        const onStart = (e: ToolEvent) => {
            const { type, touches } = e;
            if (type === 'touch' && touches!.length > 1) {
                return;
            }
            if (stylusMode && type === 'touch') {
                return;
            } else {
                updateGlobalState({ pointerDown: true });
            }
            const touch = touches && touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            lineWidth = Math.log((touch?.force ?? 0.1) + 1) * 40;
            if (selectedTool === 'pen') {
                ctx.lineWidth = lineWidth;
                points.push({ x, y, lineWidth });
            } else {
                clearCircle(ctx, x, y, 2 * lineWidth);
            }
        };

        const onMove = (e: ToolEvent) => {
            const { type, touches } = e;
            if (stylusMode && type === 'touch') {
                return;
            } else {
                updateGlobalState({ pointerDown: true });
            }
            const touch = touches && touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            lineWidth = Math.log((touch?.force ?? 0.1) + 1) * 40 * 0.2 + (lineWidth ?? 0) * 0.8;
            if (selectedTool === 'pen') {
                points!.push({ x, y, lineWidth });
                drawStroke(ctx, points!);
            } else {
                clearCircle(ctx, x, y, 2 * lineWidth);
            }
        };

        const onEnd = (e: ToolEvent) => {
            const { touches } = e;
            points = [];
            lineWidth = 0;
            if (touches?.length === 0) {
                updateGlobalState({ pointerDown: false });
            }
        };

        return registerTool(canvas, onStart, onMove, onEnd);
    }, [canvas, context, scale, stylusMode, magneticMode, selectedTool]);

    return <canvas ref={canvasRef} className="fullScreenCanvas" />;
};
