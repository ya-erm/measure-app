import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { drawGuideLines, drawWall, removeGuideLines, wallCircleRadius } from '../Draw';
import { distanceBetween, findAllGuideLines, pointProjection } from '../Geometry';
import { useGlobalContext, Wall } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

function cloneEditingWalls(walls: Wall[]): Wall[] {
    return walls
        .filter((w) => w.p1.editId || w.p2.editId)
        .map((w) => {
            const clone: Wall = {
                id: w.id,
                topText: w.topText,
                bottomText: w.bottomText,
                p1: { x: w.p1.x, y: w.p1.y },
                p2: { x: w.p2.x, y: w.p2.y },
            };
            return clone;
        });
}

export const CursorTool: React.FC = () => {
    const { commandsHistory, interactiveRef, drawing, control, setValue } = useGlobalContext();
    const { stylusMode, magneticMode, wallAlignmentMode, selectedTool } = useWatch({
        control,
        name: 'settings',
    });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });

    useEffect(() => {
        if (!interactiveRef.current || selectedTool !== 'cursor') {
            return;
        }

        let _wallBefore: Wall[] = [];
        let selectedWall: Wall | undefined;

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'stylus') return;
            setValue('pointerDown', true);
            e.changedTouches?.forEach((touch) => {
                const id = touch.identifier;
                const x = touch.pageX * scale;
                const y = touch.pageY * scale;
                const points = plan.walls
                    .flatMap((item) => [item.p1, item.p2])
                    .filter((p) => distanceBetween(p, { x, y }) <= wallCircleRadius)
                    .map((p) => {
                        p.editId = id;
                        return p;
                    });

                const newSelectedWall =
                    points.length === 0
                        ? plan.walls.find((w) => {
                              const p = pointProjection({ x, y }, w, true);
                              return p && distanceBetween({ x, y }, p) < wallCircleRadius;
                          })
                        : undefined;

                if (selectedWall) drawWall(drawing, selectedWall);
                selectedWall = newSelectedWall;
                if (selectedWall) drawWall(drawing, selectedWall, '#00f');
                setValue('selectedWall', selectedWall);

                _wallBefore = cloneEditingWalls(plan.walls);
            });
        };

        const onMove = (e: ToolEvent) => {
            if (e.type === 'mouse' && !e.buttons) return;
            e.changedTouches?.forEach((touch) => {
                const id = touch.identifier;
                const x = touch.pageX * scale;
                const y = touch.pageY * scale;
                const editingPoints = plan.walls
                    .flatMap((w) => [w.p1, w.p2])
                    .filter((p) => p.editId === id);
                editingPoints.forEach((p) => {
                    p.x = x;
                    p.y = y;
                });
                if (magneticMode && editingPoints.length > 0) {
                    const guidLines = findAllGuideLines(plan.walls, editingPoints, { x, y });
                    drawGuideLines(drawing, editingPoints[0], guidLines);
                }
                plan.walls
                    .filter((w) => w.p1.editId || w.p2.editId)
                    .forEach((w) => drawWall(drawing, w));
            });
        };

        const onEnd = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'stylus') return;
            e.changedTouches?.forEach((touch) => {
                const id = touch.identifier;
                plan.walls
                    .flatMap((w) => [w.p1, w.p2])
                    .filter((x) => x.editId === id)
                    .forEach((p) => {
                        if (magneticMode) {
                            const closePoint = plan.walls
                                .flatMap((w) => [w.p1, w.p2])
                                .filter((o) => o !== p)
                                .find((o) => distanceBetween(o, p) <= wallCircleRadius);
                            if (closePoint) {
                                p.x = closePoint.x;
                                p.y = closePoint.y;
                            }
                        }
                    });

                commandsHistory.add({
                    tool: 'cursor',
                    data: {
                        before: _wallBefore,
                        after: cloneEditingWalls(plan.walls),
                    },
                });

                plan.walls
                    .filter((w) => w.p1.editId || w.p2.editId)
                    .forEach((w) => {
                        w.p1.editId = undefined;
                        w.p2.editId = undefined;
                        drawWall(drawing, w);
                    });
                removeGuideLines(drawing, { editId: id, x: 0, y: 0 });
            });
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
