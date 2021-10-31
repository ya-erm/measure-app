import React, { useEffect, useRef } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke } from '../utils/svg/convert';

type IDrawIdOptions = {
    id?: string;
    groupId?: string;
};

type IDrawStrokeOptions = {
    stroke?: string;
    strokeWidth?: number;
    strokeDashArray?: string;
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

type IPathPoint = { x: number; y: number; pressure?: number };

export type IDrawPathOptions = {
    points: IPathPoint[];
} & IDrawShapeOptions &
    IDrawIdOptions;

export type IDrawTextOptions = {
    x: number;
    y: number;
    angle?: number;
    fontSize?: number;
    text: string;
} & IDrawShapeOptions &
    IDrawIdOptions;

export type IDrawing = {
    createGroup: (id?: string, groupId?: string) => string;
    drawLine: (options: IDrawLineOptions) => string;
    drawCircle: (options: IDrawCircleOptions) => string;
    drawRect: (options: IDrawRectOptions) => string;
    drawPath: (options: IDrawPathOptions) => string;
    drawText: (options: IDrawTextOptions) => string;
    removeElement: (id: string, groupId?: string) => void;
    removeElements: (predicate: (element: Element) => boolean, groupId?: string) => void;
};

type UseDrawingReturn = {
    svgRef: React.RefObject<SVGSVGElement>;
    drawing: IDrawing;
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function setLineOptions(line: Element, options: IDrawLineOptions) {
    const { x1, x2, y1, y2, strokeWidth, stroke = '#000', strokeDashArray } = options;
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', stroke);
    if (strokeWidth) line.setAttribute('stroke-width', strokeWidth.toString());
    if (strokeDashArray) line.setAttribute('stroke-dasharray', strokeDashArray);
}

function setRectOptions(rect: Element, options: IDrawRectOptions) {
    const { x, y, width, height, strokeWidth, stroke, fill } = options;
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    if (fill) rect.setAttribute('fill', fill);
    if (stroke) rect.setAttribute('stroke', stroke);
    if (strokeWidth) rect.setAttribute('stroke-width', strokeWidth.toString());
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

function setTextOptions(element: Element, options: IDrawTextOptions) {
    const { x, y, angle = 0, fontSize = 25, text, stroke, strokeWidth, fill } = options;
    element.setAttribute('x', x.toString());
    element.setAttribute('y', (y + 9).toString());
    element.setAttribute('style', `text-anchor: middle; font-size: ${fontSize}px`);
    element.setAttribute('transform', `rotate(${angle}, ${x}, ${y})`);
    element.textContent = text;
    if (fill) element.setAttribute('fill', fill);
    if (stroke) element.setAttribute('stroke', stroke);
    if (strokeWidth) element.setAttribute('stroke-width', strokeWidth.toString());
}

function findOrCreate(
    svg: SVGSVGElement | null,
    key: string | undefined,
    type: string,
    groupId?: string,
) {
    let element = key ? svg?.getElementById(key) : undefined;
    const id = key ?? `e${new Date().getTime()}`;
    if (!element) {
        element = document.createElementNS(SVG_NS, type);
        element.setAttribute('id', id);
        const dest = groupId ? svg?.getElementById(groupId) : svg;
        dest?.appendChild(element);
    }
    return { element, id };
}

export function useDrawing(scale: number = 1): UseDrawingReturn {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const parent = svg?.parentElement;
        if (!svg || !parent) return;
        const { width, height } = parent!.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${width * scale} ${height * scale}`);
        svg.setAttribute('version', '1.1');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('width', `${width * scale}`);
        svg.setAttribute('height', `${height * scale}`);
    }, [scale, svgRef]);

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
        drawText: (options) => {
            const { element, id } = findOrCreate(
                svgRef.current,
                options.id,
                'text',
                options.groupId,
            );
            setTextOptions(element, options);
            return id;
        },
        createGroup: (key, parentId) => {
            const { id } = findOrCreate(svgRef.current, key, 'g', parentId);
            return id;
        },
        removeElement: (id, groupId) => {
            const group = groupId ? svgRef.current?.getElementById(groupId) : svgRef.current;
            const element = group?.querySelector(`#${id}`);
            element?.remove();
        },
        removeElements: (predicate, groupId) => {
            const group = groupId ? svgRef.current?.getElementById(groupId) : svgRef.current;
            group?.childNodes?.forEach((child) => {
                if (predicate(child as Element)) {
                    child.remove();
                }
            });
        },

        drawPath: (options) => {
            const { id: key, points, groupId } = options;
            const { element: path, id } = findOrCreate(svgRef.current, key, 'path', groupId);
            if (options.stroke) path.setAttribute('fill', options.stroke);
            path.setAttribute(
                'd',
                getSvgPathFromStroke(
                    getStroke(points, {
                        // TODO: configure drawing options
                        size: options.strokeWidth,
                        smoothing: 0.5,
                        thinning: 0.5,
                    }),
                ),
            );
            return id;
        },
    };

    return {
        svgRef,
        drawing,
    };
}
