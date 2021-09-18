import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { IDrawing, useDrawing } from '../hooks/useDrawing';

export type IToolType = 'wall' | 'cursor' | 'move' | 'pencil' | 'eraser';

export type Point = {
    x: number;
    y: number;
    editId?: number;
};

export type Line = {
    id: string;
    p1: Point;
    p2: Point;
    editId?: number;
};

export type IPlan = {
    walls: Line[];
};

export type IGlobalState = {
    scale: number;
    selectedTool: IToolType;
    pointerDown: boolean;

    stylusMode: boolean;
    magneticMode: boolean;
    wallAlignmentMode: boolean;

    plan: IPlan;
};

export type IGlobalContext = {
    globalState: IGlobalState;
    setGlobalState: Dispatch<SetStateAction<IGlobalState>>;
    updateGlobalState: (state: Partial<IGlobalState>) => void;

    drawing: IDrawing;
    drawingRef: React.RefObject<SVGSVGElement>;
    interactiveRef: React.RefObject<HTMLDivElement>;
};

export function useGlobalState(): IGlobalContext {
    const defaultState: Partial<IGlobalState> = {
        scale: 2,
        selectedTool: 'wall',
        pointerDown: false,

        stylusMode: true,
        magneticMode: true,
        wallAlignmentMode: true,

        plan: {
            walls: [],
        },
    };

    const [globalState, setGlobalState] = useState<IGlobalState>(defaultState as any);

    const updateGlobalState = useCallback(
        (update) => setGlobalState((prev) => ({ ...prev, ...update })),
        [],
    );

    const interactiveRef = useRef<HTMLDivElement>(null);
    const { svgRef: drawingRef, drawing } = useDrawing(globalState.scale);
    const context: IGlobalContext = {
        drawing,
        drawingRef,
        interactiveRef,

        globalState,
        setGlobalState,
        updateGlobalState,
    };
    return context;
}

export const GlobalContext = React.createContext<IGlobalContext>(null!);

export const useGlobalContext = () => {
    const context = React.useContext<IGlobalContext>(GlobalContext);
    if (context === null) {
        throw new Error('useGlobalContext must be used within an GlobalContext.Provider');
    }
    return context;
};
