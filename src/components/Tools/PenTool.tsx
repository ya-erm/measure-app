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
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) return;
            updateGlobalState({ pointerDown: true });
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            lineWidth = Math.log((touch?.force || 0.1) + 1) * 40;
            if (selectedTool === 'pen') {
                ctx.lineWidth = lineWidth;
                points.push({ x, y, lineWidth });
            } else {
                clearCircle(ctx, x, y, 3 * lineWidth);
            }
        };

        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'mouse' && !e.buttons) return;
            const touch = e.touches && e.touches[0];
            const x = (touch?.pageX ?? e.x) * scale;
            const y = (touch?.pageY ?? e.y) * scale;
            lineWidth = Math.log((touch?.force || 0.1) + 1) * 40 * 0.2 + (lineWidth ?? 0) * 0.8;
            if (selectedTool === 'pen') {
                points!.push({ x, y, lineWidth });
                drawStroke(ctx, points!);
            } else {
                clearCircle(ctx, x, y, 3 * lineWidth);
            }
        };

        const onEnd = (e: ToolEvent) => {
            points = [];
            lineWidth = 0;
            if (!e.touches || e.touches.length === 0) {
                updateGlobalState({ pointerDown: false });
            }
        };

        return registerTool(canvas, onStart, onMove, onEnd);
    }, [canvas, context, scale, stylusMode, magneticMode, selectedTool]);

    return <canvas ref={canvasRef} className="fullScreenCanvas" />;
};
