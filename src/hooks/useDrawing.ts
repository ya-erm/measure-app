import React, { useEffect, useRef } from 'react';
import { Convert, PointObject } from '../utils/svg/convert';

type IDrawIdOptions = {
    id?: string;
    groupId?: string;
};

type IDrawStrokeOptions = {
    stroke?: string;
    strokeWidth?: number;
};
type IDrawShapeOptions = {
    fill?: string;
} & IDrawStrokeOptions;

type IDrawLineOptions = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} & IDrawStrokeOptions &
    IDrawIdOptions;

type IDrawRectOptions = {
    x: number;
    y: number;
    width: number;
    height: number;
} & IDrawShapeOptions &
    IDrawIdOptions;

type IDrawCircleOptions = {
    x: number;
    y: number;
    rx: number;
    ry: number;
} & IDrawShapeOptions &
    IDrawIdOptions;

type IDrawPathOptions = {
    points: Array<PointObject>;
    strokeLinecap?: 'butt' | 'round' | 'square';
    close?: boolean;
} & IDrawShapeOptions &
    IDrawIdOptions;

export type IDrawing = {
    createGroup: (id?: string, groupId?: string) => string;
    drawLine: (options: IDrawLineOptions) => string;
    drawCircle: (options: IDrawCircleOptions) => string;
    drawRect: (options: IDrawRectOptions) => string;
    drawPath: (options: IDrawPathOptions) => string;
    removeElement: (id: string) => void;
};

type UseDrawingReturn = {
    svgRef: React.RefObject<SVGSVGElement>;
    drawing: IDrawing;
};

const SVG_NS = 'http://www.w3.org/2000/svg';

let IID = 0;

function setLineOptions(line: Element, options: IDrawLineOptions) {
    const { x1, x2, y1, y2, strokeWidth, stroke = '#000' } = options;
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', stroke);
    if (strokeWidth) line.setAttribute('stroke-width', strokeWidth.toString());
}

function setRectOptions(ellipse: Element, options: IDrawRectOptions) {
    const { x, y, width, height, strokeWidth, stroke, fill } = options;
    ellipse.setAttribute('x', x.toString());
    ellipse.setAttribute('y', y.toString());
    ellipse.setAttribute('width', width.toString());
    ellipse.setAttribute('height', height.toString());
    if (fill) ellipse.setAttribute('fill', fill);
    if (stroke) ellipse.setAttribute('stroke', stroke);
    if (strokeWidth) ellipse.setAttribute('stroke-width', strokeWidth.toString());
}

function setCircleOptions(ellipse: Element, options: IDrawCircleOptions) {
    const { x, y, rx, ry, strokeWidth, stroke, fill } = options;
    ellipse.setAttribute('cx', x.toString());
    ellipse.setAttribute('cy', y.toString());
    ellipse.setAttribute('rx', rx.toString());
    ellipse.setAttribute('ry', ry.toString());
    if (fill) ellipse.setAttribute('fill', fill);
    if (stroke) ellipse.setAttribute('stroke', stroke);
    if (strokeWidth) ellipse.setAttribute('stroke-width', strokeWidth.toString());
}

function setPathOptions(path: Element, options: IDrawPathOptions) {
    const { strokeWidth, stroke, fill, strokeLinecap, close = false } = options;
    if (fill) path.setAttribute('fill', fill);
    if (stroke) path.setAttribute('stroke', stroke);
    if (strokeWidth) path.setAttribute('stroke-width', strokeWidth.toString());
    if (strokeLinecap) path.setAttribute('stroke-linecap', strokeLinecap);
    path.setAttribute('close', `${close}`);
}

function findOrCreate(
    svg: SVGSVGElement | null,
    key: string | undefined,
    type: string,
    groupId?: string,
) {
    let element = key ? svg?.getElementById(key) : undefined;
    const id = key ?? `${IID++}`;
    if (!element) {
        element = document.createElementNS(SVG_NS, type);
        element.setAttribute('id', id);
        const dest = groupId ? svg?.getElementById(groupId) : svg;
        dest?.appendChild(element);
    }
    return { element, id };
}

export function useDrawing(): UseDrawingReturn {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current!;
        const parent = svg!.parentElement;
        const { width, height } = parent!.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('version', '1.1');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());
    }, []);

    const drawing: IDrawing = {
        drawLine: (options) => {
            const { element, id } = findOrCreate(
                svgRef.current,
                options.id,
                'line',
                options.groupId,
            );
            setLineOptions(element, options);
            return id;
        },
        drawCircle: (options) => {
            const { element, id } = findOrCreate(
                svgRef.current,
                options.id,
                'ellipse',
                options.groupId,
            );
            setCircleOptions(element, options);
            return id;
        },
        drawRect: (options) => {
            const { element, id } = findOrCreate(
                svgRef.current,
                options.id,
                'rect',
                options.groupId,
            );
            setRectOptions(element, options);
            return id;
        },
        createGroup: (key, parentId) => {
            const { id } = findOrCreate(svgRef.current, key, 'g', parentId);
            return id;
        },
        removeElement: (id) => {
            const element = svgRef.current!.getElementById(id);
            element.remove();
        },

        drawPath: (options) => {
            const { id: key, points, groupId } = options;
            const { element: path, id } = findOrCreate(svgRef.current, key, 'path', groupId);
            setPathOptions(path, options);
            const converter = new Convert();
            const commands = converter.bezierCurveCommands(points);
            path.setAttribute('d', commands.map((c) => c.toString()).join(' '));
            return id;
        },
    };

    return {
        svgRef,
        drawing,
    };
}
