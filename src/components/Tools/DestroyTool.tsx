import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { drawCircle, wallGroupId } from '../Draw';
import { crossLines } from '../Geometry';
import { getViewBox, Point, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const DestroyTool: React.FC = () => {
    const { commandsHistory, interactiveRef, drawingRef, drawing, control, setValue } =
        useGlobalContext();
    const { stylusMode, selectedTool } = useWatch({ control, name: 'settings' });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });

    useEffect(() => {
        if (!interactiveRef.current || selectedTool !== 'destroy') {
            return;
        }

        let start: Point | undefined;

        const onStart = (e: ToolEvent) => {
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) {
                return;
            }
            setValue('pointerDown', true);
            start = { x, y, editId: e.id };
        };
        const onMove = (e: ToolEvent) => {
            if (e.type === 'mouse' && !e.buttons) return;
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            drawing.createGroup('cross', 'walls');
            drawing.drawLine({
                id: `d${e.id}`,
                x1: start!.x,
                y1: start!.y,
                x2: x,
                y2: y,
                stroke: 'red',
                strokeWidth: scale,
                groupId: 'cross',
            });
            const destroyLine = { id: `${e.id}`, p1: start!, p2: { x, y } };
            const crosses = plan.walls
                .map((w) => crossLines(w, destroyLine, true))
                .filter((p) => p);
            const crossIds = crosses.map((p, i) => {
                const crossId = `x${i}`;
                drawCircle(drawing, crossId, 'cross', p!.x, p!.y, 5, 'red');
                return crossId;
            });
            drawing.removeElements(
                (e) => e.id.startsWith('x') && !crossIds.includes(e.id),
                'cross',
            );
        };
        const onEnd = (e: ToolEvent) => {
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            const destroyLine = { id: `${e.id}`, p1: start!, p2: { x, y } };
            const destroyedWalls = plan.walls.filter((w) => crossLines(w, destroyLine, true));
            destroyedWalls.forEach((w) => drawing.removeElement(wallGroupId(w)));
            plan.walls = plan.walls.filter((w) => !destroyedWalls.includes(w));
            commandsHistory.add({
                tool: 'destroy',
                data: { destroyedWalls },
            });
            drawing.removeElement('cross');
            if (!e.touches || e.touches?.length === 0) {
                setValue('pointerDown', false);
            }
        };

        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
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
