import React, { useEffect, useRef } from 'react';
import { Control, useForm, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { IDrawing, IDrawPathOptions, useDrawing } from '../hooks/useDrawing';
import { drawWall, wallCircleRadius, wallGroupId } from './Draw';
import { distanceBetween, pointProjection } from './Geometry';
import { IHistory, useHistory } from './History/useHistory';

export type IToolType = 'wall' | 'cursor' | 'move' | 'pencil' | 'eraser' | 'destroy';

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

export type IWallType = 'wall' | 'window' | 'door' | 'ruler';

export type Wall = Line & {
    topText?: string;
    bottomText?: string;
    type?: IWallType;
    variant?: string;
};

export type IPlan = {
    walls: Wall[];
    notes: IDrawPathOptions[];
};

export type ISettings = {
    stylusMode: boolean;
    magneticMode: boolean;
    wallAlignmentMode: boolean;
    selectedTool: IToolType;
};

export type IGlobalState = {
    settings: ISettings;
    pointerDown: boolean;
    selectedWall?: Wall;
    scale: number;
    plan: IPlan;
};

export type IGlobalContext = {
    drawing: IDrawing;
    drawingRef: React.RefObject<SVGSVGElement>;
    interactiveRef: React.RefObject<HTMLDivElement>;

    control: Control<IGlobalState, object>;
    getValues: UseFormGetValues<IGlobalState>;
    setValue: UseFormSetValue<IGlobalState>;

    commandsHistory: IHistory;
};

export function saveSettings(settings: ISettings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

export function loadSettings() {
    const defaultSettings = {
        stylusMode: true,
        magneticMode: true,
        wallAlignmentMode: true,
        selectedTool: 'wall',
    };
    try {
        const json = localStorage.getItem('settings');
        if (!json) return defaultSettings;
        return JSON.parse(json);
    } catch {}
    return defaultSettings;
}

export function savePlan(plan: IPlan) {
    // console.log('Store plan', plan);
    localStorage.setItem('plan', JSON.stringify(plan));
}

export function loadPlan(): IPlan {
    const defaultPlan = {
        walls: [],
        notes: [],
    };
    try {
        const json = localStorage.getItem('plan');
        if (!json) return defaultPlan;
        const plan = JSON.parse(json);
        console.log('Restore plan', plan);
        return plan;
    } catch {
        console.log('Failed to restore plan');
    }
    return defaultPlan;
}

export function drawPlan(drawing: IDrawing, plan: IPlan | undefined) {
    plan?.walls?.forEach((w) => drawWall(drawing, w));
    plan?.notes?.forEach((n) => drawing.drawPath(n));
}

export function erasePlan(drawing: IDrawing, plan: IPlan) {
    plan.walls?.forEach((w) => drawing.removeElement(wallGroupId(w)));
    plan.notes?.filter((n) => n.id).forEach((n) => drawing.removeElement(n.id!));
}

const defaultState: IGlobalState = {
    settings: loadSettings(),
    pointerDown: false,
    scale: 1,
    plan: loadPlan(),
};

export function useGlobalState(): IGlobalContext {
    const { control, getValues, setValue } = useForm<IGlobalState>({
        defaultValues: defaultState,
    });
    const scale = defaultState.scale;
    const plan = defaultState.plan;
    // console.log('useGlobalState', plan);

    const { svgRef: drawingRef, drawing } = useDrawing(scale);
    const commandsHistory = useHistory(drawing, plan);

    useEffect(() => {
        drawPlan(drawing, defaultState.plan);
    }, [drawing]);

    const interactiveRef = useRef<HTMLDivElement>(null);
    const context: IGlobalContext = {
        drawing,
        drawingRef,
        interactiveRef,

        control,
        getValues,
        setValue,

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

export function getViewBox(ref: React.RefObject<SVGSVGElement>) {
    const viewBox = ref.current
        ?.getAttribute('viewBox')
        ?.split(' ')
        .map((x) => parseInt(x)) ?? [0, 0];
    const size = ref.current!.getBoundingClientRect();
    return {
        x: viewBox[0],
        y: viewBox[1],
        width: viewBox[2],
        height: viewBox[3],
        ratio: size.width / viewBox[3],
    };
}

export function findNearPoints(plan: IPlan, x: number, y: number) {
    return plan.walls
        .flatMap((item) => [item.p1, item.p2])
        .filter((p) => distanceBetween(p, { x, y }) <= wallCircleRadius);
}

export function findNearWall(plan: IPlan, x: number, y: number) {
    return plan.walls.find((w) => {
        const p = pointProjection({ x, y }, w, true);
        return p && distanceBetween({ x, y }, p) < wallCircleRadius;
    });
}
