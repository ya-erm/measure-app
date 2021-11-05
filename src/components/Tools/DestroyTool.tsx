import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { drawCircle, drawWall, wallGroupId } from '../Draw';
import { crossLines } from '../Geometry';
import { findNearWall, getViewBox, Point, useGlobalContext, Wall } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const DestroyTool: React.FC = () => {
    const { commandsHistory, interactiveRef, drawingRef, drawing, control, setValue } =
        useGlobalContext();
    const { stylusMode, selectedTool } = useWatch({ control, name: 'settings' });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });

    useEffect(() => {
        if (!interactiveRef.current || selectedTool !== 'destroy') return;
        interactiveRef.current.style.cursor = 'crosshair';

        let _startPoint: Point | undefined;
        let _removingWalls: Wall[] = [];

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) {
                return;
            }
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            setValue('pointerDown', true);
            _startPoint = { x, y, editId: e.id };
        };

        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            _removingWalls.forEach((w) => {
                drawWall(drawing, w);
            });
            _removingWalls = [];
            if (e.type === 'mouse' && !e.buttons) {
                const wall = findNearWall(plan, x, y);
                if (wall) {
                    _removingWalls.push(wall);
                }
                interactiveRef.current!.style.cursor = wall ? 'pointer' : 'crosshair';
            }
            if (_startPoint) {
                drawing.createGroup('cross', 'walls');
                drawing.drawLine({
                    id: `d${e.id}`,
                    x1: _startPoint.x,
                    y1: _startPoint.y,
                    x2: x,
                    y2: y,
                    stroke: 'red',
                    strokeWidth: scale,
                    groupId: 'cross',
                });
                const destroyLine = { id: `${e.id}`, p1: _startPoint, p2: { x, y } };
                const crosses = plan.walls
                    .map((w) => {
                        const point = crossLines(w, destroyLine, true);
                        return point ? { point, wall: w } : undefined;
                    })
                    .filter((x) => x);
                const crossIds = crosses.map((item, i) => {
                    const { point, wall } = item!;
                    _removingWalls.push(wall);
                    const crossId = `x${wall.id}`;
                    drawCircle(drawing, crossId, 'cross', point.x, point.y, 5, 'red');
                    return crossId;
                });
                drawing.removeElements(
                    (e) => e.id.startsWith('x') && !crossIds.includes(e.id),
                    'cross',
                );
            }
            _removingWalls.forEach((w) => {
                drawWall(drawing, w, 'red');
            });
        };

        const onEnd = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            let destroyedWalls: Wall[] = [];
            if (_startPoint) {
                const destroyLine = { id: `${e.id}`, p1: _startPoint, p2: { x, y } };
                destroyedWalls = plan.walls.filter((w) => crossLines(w, destroyLine, true));
                drawing.removeElement('cross');
            }
            const wall = findNearWall(plan, x, y);
            if (wall) {
                destroyedWalls.push(wall);
            }
            destroyedWalls.forEach((w) => drawing.removeElement(wallGroupId(w)));
            plan.walls = plan.walls.filter((w) => !destroyedWalls.includes(w));
            _removingWalls = [];
            commandsHistory.add({
                tool: 'destroy',
                data: { destroyedWalls },
            });
            _startPoint = undefined;
            if (!e.touches || e.touches?.length === 0) {
                setValue('pointerDown', false);
            }
        };

        const unsubscribe = registerTool(interactiveRef.current, onStart, onMove, onEnd);
        return () => {
            unsubscribe();
            drawing.removeElement('cross');
            _removingWalls.forEach((w) => drawWall(drawing, w));
        };
    }, [
        scale,
        stylusMode,
        commandsHistory,
        interactiveRef,
        selectedTool,
        drawingRef,
        drawing,
        plan,
        setValue,
    ]);

    return null;
};
