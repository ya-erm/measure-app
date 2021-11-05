import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { Point, useGlobalContext } from '../GlobalContext';
import { registerTool, ToolEvent } from './ToolEvent';

export const MoveTool: React.FC = () => {
    const { interactiveRef, drawingRef, control, setValue } = useGlobalContext();
    const { stylusMode, selectedTool } = useWatch({ control, name: 'settings' });
    const scale = useWatch({ control, name: 'scale' });

    useEffect(() => {
        if (!interactiveRef.current || !drawingRef.current) {
            return;
        }
        if (!stylusMode && selectedTool !== 'move') return;
        if (selectedTool === 'move') {
            interactiveRef.current.style.cursor = 'grab';
        }

        let _startPoint: Point | undefined;
        let _startViewBox: Point | undefined;

        const onStart = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'touch' && selectedTool !== 'move') return;
            if (e.touches?.length === 1) {
                const x = e.x * scale;
                const y = e.y * scale;
                _startPoint = { x, y };
                const viewBox = drawingRef.current
                    ?.getAttribute('viewBox')
                    ?.split(' ')
                    ?.map((x) => parseInt(x)) ?? [0, 0];
                _startViewBox = { x: viewBox[0], y: viewBox[1] };
                setValue('pointerDown', true);
                interactiveRef.current!.style.cursor = 'grabbing';
            }
        };
        const onMove = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'touch' && selectedTool !== 'move') return;
            if (e.touches?.length === 1) {
                const x = e.x * scale;
                const y = e.y * scale;

                if (!_startPoint || !_startViewBox) {
                    return;
                }
                const vx = _startViewBox.x - (x - _startPoint.x);
                const vy = _startViewBox.y - (y - _startPoint.y);

                const size = drawingRef.current!.getBoundingClientRect();
                const viewBox = drawingRef.current!.getAttribute('viewBox')?.split(' ') ?? [
                    0,
                    0,
                    size.width,
                    size.height,
                ];
                const value = `${vx} ${vy} ${viewBox[2]} ${viewBox[3]}`;
                drawingRef.current?.setAttribute('viewBox', value);
            }
        };
        const onEnd = (e: ToolEvent) => {
            if (stylusMode && e.type !== 'touch' && selectedTool !== 'move') return;
            _startPoint = undefined;
            _startViewBox = undefined;
            interactiveRef.current!.style.cursor = 'grab';
            setValue('pointerDown', false);
        };
        return registerTool(interactiveRef.current, onStart, onMove, onEnd);
    }, [drawingRef, interactiveRef, scale, selectedTool, stylusMode, setValue]);

    return null;
};
