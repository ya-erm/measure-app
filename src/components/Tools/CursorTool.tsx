import React, { useEffect } from 'react';
import { drawWall, wallCircleRadius } from '../Draw';
import { distanceBetween } from '../Geometry';
import { useGlobalContext } from '../GlobalContext';
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
            });
        };

        const onMove = (e: ToolEvent) => {
            if (e.type === 'mouse' && !e.buttons) return;
            e.changedTouches?.forEach((touch) => {
                const id = touch.identifier;
                const x = touch.pageX * scale;
                const y = touch.pageY * scale;
                plan.walls
                    .flatMap((w) => [w.p1, w.p2])
                    .filter((p) => p.editId === id)
                    .forEach((p) => {
                        p.x = x;
                        p.y = y;
                    });
                plan.walls
                    .filter((w) => w.p1.editId || w.p2.editId)
                    .forEach((w) => drawWall(drawing, w));
            });
        };

        const onEnd = (e: ToolEvent) => {
            e.changedTouches?.forEach((touch) => {
                const id = touch.identifier;
                plan.walls
                    .flatMap((item) => [item.p1, item.p2])
                    .filter((x) => x.editId === id)
                    .forEach((p) => {
                        p.editId = undefined;
                        if (magneticMode) {
                            const closePoint = plan.walls
                                .flatMap((item) => [item.p1, item.p2])
                                .filter((o) => o !== p && o.x !== p.x && o.y !== p.y)
                                .find((o) => distanceBetween(o, p) <= wallCircleRadius);

                            if (closePoint) {
                                p.x = closePoint.x;
                                p.y = closePoint.y;
                            }
                        }
                    });
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
