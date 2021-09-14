type TypedTouch = Touch & { touchType: 'stylus' | 'direct' };

export type ToolEvent = {
    id: number;
    x: number;
    y: number;

    type: 'mouse' | 'stylus' | 'touch';
    touches?: TypedTouch[];
    changedTouches?: TypedTouch[];
};

export type ToolEventHandler = (e: ToolEvent) => void;

export function registerTool(
    element: HTMLElement,
    onStart: ToolEventHandler,
    onMove: ToolEventHandler,
    onEnd: ToolEventHandler,
) {
    function mouseToToolEvent(e: MouseEvent): ToolEvent {
        return {
            id: 1,
            x: e.pageX,
            y: e.pageY,
            type: 'mouse',
            changedTouches: [
                {
                    identifier: 1,
                    pageX: e.pageX,
                    pageY: e.pageY,
                } as any as TypedTouch,
            ],
        };
    }
    const onMouseDown = (e: MouseEvent) => onStart(mouseToToolEvent(e));
    const onMouseMove = (e: MouseEvent) => onMove(mouseToToolEvent(e));
    const onMouseUp = (e: MouseEvent) => onEnd(mouseToToolEvent(e));

    function touchToToolEvent(e: TouchEvent): ToolEvent {
        const touch = e.changedTouches[0] as TypedTouch;
        return {
            id: touch.identifier,
            x: touch.pageX,
            y: touch.pageY,
            touches: Array.from(e.touches) as TypedTouch[],
            changedTouches: Array.from(e.changedTouches) as TypedTouch[],
            type: touch.touchType === 'stylus' ? 'stylus' : 'touch',
        };
    }
    const onTouchStart = (e: TouchEvent) => onStart(touchToToolEvent(e));
    const onTouchMove = (e: TouchEvent) => onMove(touchToToolEvent(e));
    const onTouchEnd = (e: TouchEvent) => onEnd(touchToToolEvent(e));

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);
    element.addEventListener('touchend', onTouchEnd);

    return () => {
        element.removeEventListener('mousedown', onMouseDown);
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseup', onMouseUp);

        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchend', onTouchEnd);
    };
}
