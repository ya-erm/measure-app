import React, { useEffect } from 'react';
import { drawGuideLines, drawWall, removeGuideLines, wallCircleRadius } from '../Draw';
import { distanceBetween, findAllGuideLines } from '../Geometry';
import { Line, useGlobalContext } from '../GlobalContext';
import { drawHistory } from '../History/HistoryPanel';
import { registerTool, ToolEvent } from './ToolEvent';

export const CursorTool: React.FC = () => {
    const { interactiveRef, drawing, globalState, updateGlobalState } = useGlobalContext();
    const { scale, stylusMode, magneticMode, selectedTool, plan } = globalState;

    useEffect(() => {
        if (!interactiveRef.current || selectedTool !== 'cursor') {
            return;
        }

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            updateGlobalState({ pointerDown: true });
            e.changedTouches?.forEach((touch) => {
                const id = touch.identifier;
                const x = touch.pageX * scale;
                const y = touch.pageY * scale;
                plan.walls
                    .flatMap((item) => [item.p1, item.p2])
                    .filter((p) => distanceBetween(p, { x, y }) <= wallCircleRadius)
                    .forEach((p) => {
                        p.editId = id;
                    });

                drawHistory.push({
                    tool: 'cursor',
                    data: plan.walls
                        .filter((w) => w.p1.editId || w.p2.editId)
                        .map((w) => {
                            const clone: Line = {
                                id: w.id,
                                p1: { x: w.p1.x, y: w.p1.y },
                                p2: { x: w.p2.x, y: w.p2.y },
                            };
                            return clone;
                        }),
                });
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
                plan.walls
                    .filter((w) => w.p1.editId || w.p2.editId)
                    .forEach((w) => {
                        w.p1.editId = undefined;
                        w.p2.editId = undefined;
                        drawWall(drawing, w);
                    });
                removeGuideLines(drawing, { editId: id, x: 0, y: 0 });
            });
            if (e.touches?.length === 0) {
                updateGlobalState({ pointerDown: false });
            }
        };

        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactiveRef.current, scale, stylusMode, magneticMode, selectedTool]);

    return null;
};
