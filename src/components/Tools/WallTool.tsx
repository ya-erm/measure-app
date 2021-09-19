import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import {
    drawGuideLines,
    drawWall,
    drawWallStart,
    removeGuideLines,
    wallCircleRadius,
    wallGroupId,
} from '../Draw';
import { distanceBetween, findAlignedGuideLines, getWallOrientation } from '../Geometry';
import { Line, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const WallTool: React.FC = () => {
    const { commandsHistory, interactiveRef, drawing, control, setValue } = useGlobalContext();
    const { stylusMode, magneticMode, wallAlignmentMode, selectedTool } = useWatch({
        control,
        name: 'settings',
    });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });

    useEffect(() => {
        if (!interactiveRef.current || selectedTool !== 'wall') {
            return;
        }

        const cancel = (id: number) => {
            const wallIndex = plan.walls.findIndex((x) => x.editId === id);
            if (wallIndex >= 0) {
                const walls = plan.walls.splice(wallIndex, 1);
                drawing.removeElement(wallGroupId(walls[0]));
                walls[0].editId = undefined;
            }
        };

        const onStart = (e: ToolEvent) => {
            const x = e.x * scale;
            const y = e.y * scale;
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) {
                setValue('pointerDown', false);
                cancel(e.touches![0].identifier);
                return;
            }
            setValue('pointerDown', true);
            const wallId =
                plan.walls.length > 0
                    ? Math.max.apply(
                          null,
                          plan.walls.map((w) => parseInt(w.id)),
                      ) + 1
                    : 1;
            const wall: Line = {
                id: `${wallId}`,
                editId: e.id,
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
            drawWallStart(drawing, wall);
        };

        const onMove = (e: ToolEvent) => {
            if (e.type === 'mouse' && !e.buttons) return;
            const x = e.x * scale;
            const y = e.y * scale;
            const wall = plan.walls.find((x) => x.editId === e.id);
            if (wall) {
                wall.p2.x = x;
                wall.p2.y = y;
                if (wallAlignmentMode) {
                    const orientation = getWallOrientation({ p1: wall.p1, p2: { x, y } });
                    if (orientation === 'horizontal') {
                        wall.p2.y = wall.p1.y;
                    } else {
                        wall.p2.x = wall.p1.x;
                    }
                    const guideLines = findAlignedGuideLines(plan.walls, wall);
                    drawGuideLines(drawing, wall.p2, guideLines);
                }
                drawWall(drawing, wall);
            }
        };

        const onEnd = (e: ToolEvent) => {
            const wall = plan.walls.find((x) => x.editId === e.id);
            if (wall) {
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
                removeGuideLines(drawing, wall.p2);
                drawWall(drawing, wall);
                wall.editId = undefined;
                commandsHistory.add({
                    tool: 'wall',
                    data: { addedWall: wall },
                });
            }
            if (!e.touches || e.touches?.length === 0) {
                setValue('pointerDown', false);
            }
        };

        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
    }, [
        scale,
        stylusMode,
        magneticMode,
        wallAlignmentMode,
        commandsHistory,
        interactiveRef,
        selectedTool,
        plan.walls,
        drawing,
        setValue,
    ]);

    return null;
};
