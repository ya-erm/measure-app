import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { IDrawing, useDrawing } from '../hooks/useDrawing';
import { drawWall } from './Draw';
import { IHistory, useHistory } from './History/useHistory';

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

    commandsHistory: IHistory;
};

export function savePlan(plan: IPlan) {
    localStorage.setItem('plan', JSON.stringify(plan));
}

export function loadPlan(json?: string | null): IPlan {
    const defaultPlan = {
        walls: [],
    };
    try {
        if (!json) return defaultPlan;
        const plan = JSON.parse(json);
        console.log('Restored plan', plan);
        return plan;
    } catch {
        console.log('Failed to restore plan');
    }
    return defaultPlan;
}

export function useGlobalState(): IGlobalContext {
    const defaultState: Partial<IGlobalState> = useMemo(
        () => ({
            scale: 2,
            selectedTool: 'wall',
            pointerDown: false,

            stylusMode: true,
            magneticMode: true,
            wallAlignmentMode: true,

            plan: loadPlan(localStorage.getItem('plan')),
        }),
        [],
    );

    const [globalState, setGlobalState] = useState<IGlobalState>(defaultState as any);

    const updateGlobalState = useCallback(
        (update) => setGlobalState((prev) => ({ ...prev, ...update })),
        [],
    );

    const { svgRef: drawingRef, drawing } = useDrawing(globalState.scale);

    const commandsHistory = useHistory(drawing, globalState.plan);

    useEffect(() => {
        defaultState.plan?.walls.forEach((w) => drawWall(drawing, w));
    }, [drawing, defaultState]);

    const interactiveRef = useRef<HTMLDivElement>(null);
    const context: IGlobalContext = {
        drawing,
        drawingRef,
        interactiveRef,

        globalState,
        setGlobalState,
        updateGlobalState,

        commandsHistory,
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
