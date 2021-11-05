import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { DrawPoint } from '../Draw';
import { getViewBox, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const PenTool: React.FC = () => {
    const { commandsHistory, interactiveRef, drawingRef, drawing, control, setValue } =
        useGlobalContext();
    const { stylusMode, magneticMode, selectedTool } = useWatch({ control, name: 'settings' });
    const scale = useWatch({ control, name: 'scale' });
    const plan = useWatch({ control, name: 'plan' });

    useEffect(() => {
        if (!interactiveRef.current) {
            return;
        }
        switch (selectedTool) {
            case 'pencil':
                interactiveRef.current.style.cursor = 'crosshair';
                break;
            case 'eraser':
                interactiveRef.current.style.cursor = 'url("/cursors/circle.svg") 12 12, auto';
                break;
            default:
                return;
        }
        let points: DrawPoint[] = [];
        let id: string | undefined;

        const getStrokeOptions = () => {
            return {
                strokeWidth: scale * (selectedTool === 'eraser' ? 15 : 1.5),
                stroke: selectedTool === 'pencil' ? '#000' : '#fff',
            };
        };

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'touch' && e.touches!.length > 1) return;
            setValue('pointerDown', true);
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            const force = e.touches[0]?.force;
            const pressure = force ? Number(force.toFixed(3)) : undefined;
            points.push({ x, y, pressure });
            const { stroke, strokeWidth } = getStrokeOptions();
            id = drawing.drawPath({
                points,
                stroke,
                strokeWidth,
                groupId: 'pen',
            });
        };

        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            if (e.type === 'mouse' && !e.buttons) return;
            const viewBox = getViewBox(drawingRef);
            const x = viewBox.x + e.x * scale;
            const y = viewBox.y + e.y * scale;
            const force = e.touches[0]?.force;
            const pressure = force ? Number(force.toFixed(3)) : undefined;
            points.push({ x, y, pressure });
            const { strokeWidth } = getStrokeOptions();
            drawing.drawPath({ id, points, strokeWidth });
        };

        const onEnd = (e: ToolEvent) => {
            if (stylusMode && e.type === 'touch') return;
            const strokeOptions = getStrokeOptions();
            const path = { id, points, ...strokeOptions, groupId: 'pen' };
            plan.notes.push(path);
            commandsHistory.add({
                tool: selectedTool as 'pencil' | 'eraser',
                data: { options: path },
            });
            id = undefined;
            points = [];
            if (!e.touches || e.touches?.length === 0) {
                setValue('pointerDown', false);
            }
        };

        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
    }, [
        scale,
        stylusMode,
        magneticMode,
        interactiveRef,
        commandsHistory,
        selectedTool,
        drawingRef,
        drawing,
        plan,
        setValue,
    ]);

    return null;
};
