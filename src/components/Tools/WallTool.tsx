import React, { useEffect, useRef } from 'react';
import { drawWall, drawWallEnd, drawWallStart, wallCircleRadius } from '../Draw';
import { distanceBetween, getWallOrientation } from '../Geometry';
import { Line, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const WallTool: React.FC = () => {
    const { globalState, updateGlobalState } = useGlobalContext();
    const {
        scale,
        canvas,
        context,
        stylusMode,
        magneticMode,
        wallAlignmentMode,
        selectedTool,
        plan,
    } = globalState;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // TODO: on resize
    const width = window.innerWidth * scale;
    const height = window.innerHeight * scale;

    useEffect(() => {
        canvasRef.current!.width = width;
        canvasRef.current!.height = height;
    }, []);

    useEffect(() => {
        if (!canvas || selectedTool !== 'wall') {
            return;
        }

        const ctx = canvasRef.current!.getContext('2d')!;
        const redrawEditingLines = () => {
            ctx.clearRect(0, 0, width, height);
            plan.walls
                .filter((x) => x.editId)
                .forEach((wall) => {
                    drawWall(ctx, wall);
                });
        };

        const cancel = (id: number) => {
            const wallIndex = plan.walls.findIndex((x) => x.editId === id);
            if (wallIndex >= 0) {
                plan.walls.splice(wallIndex, 1);
                redrawEditingLines();
            }
        };

        const onStart = (e: ToolEvent) => {
            const { id, type, touches } = e;
            const x = e.x * scale;
            const y = e.y * scale;
            if (type === 'touch' && touches!.length > 1) {
                cancel(id);
                return;
            }
            if (stylusMode && type === 'touch') {
                return;
            } else {
                updateGlobalState({ pointerDown: true });
            }
            const wall: Line = {
                editId: id,
                p1: { x, y },
                p2: { x, y },
            };
            if (magneticMode) {
                const closePoint = plan.walls
                    .flatMap((item) => [item.p1, item.p2])
                    .find((p) => distanceBetween(p, wall.p1) <= wallCircleRadius);

                if (closePoint) {
                    wall.p1.x = closePoint.x;
                    wall.p1.y = closePoint.y;
                    wall.p2.x = closePoint.x;
                    wall.p2.y = closePoint.y;
                }
            }
            plan.walls.push(wall);
            drawWallStart(ctx, wall);
        };

        const onMove = (e: ToolEvent) => {
            const { id } = e;
            const x = e.x * scale;
            const y = e.y * scale;
            const wall = plan.walls.find((x) => x.editId === id);
            if (wall) {
                wall.p2.x = x;
                wall.p2.y = y;
                if (wallAlignmentMode) {
                    if (getWallOrientation({ p1: wall.p1, p2: { x, y } }) === 'horizontal') {
                        wall.p2.y = wall.p1.y;
                    } else {
                        wall.p2.x = wall.p1.x;
                    }
                }
                redrawEditingLines();
            }
        };

        const onEnd = (e: ToolEvent) => {
            const { id, touches } = e;
            const wall = plan.walls.find((x) => x.editId === id);
            if (wall) {
                wall.editId = undefined;
                if (magneticMode) {
                    const closePoint = plan.walls
                        .filter((w) => w !== wall)
                        .flatMap((item) => [item.p1, item.p2])
                        .find((p) => distanceBetween(p, wall.p2) <= wallCircleRadius);

                    if (closePoint) {
                        wall.p2.x = closePoint.x;
                        wall.p2.y = closePoint.y;
                    }
                }
                redrawEditingLines();
                drawWallEnd(context, wall);
                drawWall(context, wall);
            }
            if (touches?.length === 0) {
                updateGlobalState({ pointerDown: false });
            }
        };

        return registerTool(canvas, onStart, onMove, onEnd);
    }, [canvas, context, stylusMode, magneticMode, wallAlignmentMode, selectedTool]);

    return <canvas ref={canvasRef} className="fullScreenCanvas" />;
};
