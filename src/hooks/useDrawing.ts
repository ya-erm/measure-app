import { getStroke } from 'perfect-freehand';
import React, { useEffect, useRef } from 'react';
import { polarToCartesian } from '../components/Geometry';
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

type IDrawRotateOptions = {
    angle?: number;
    rx?: number;
    ry?: number;
};

type IDrawShapeOptions = {
    fill?: string;
} & IDrawStrokeOptions &
    IDrawRotateOptions;

type IDrawLineOptions = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} & IDrawStrokeOptions &
    IDrawRotateOptions &
    IDrawIdOptions;

type IDrawRectOptions = {
    cx: number;
    cy: number;
    width: number;
    height: number;
    angle?: number;
} & IDrawShapeOptions &
    IDrawIdOptions;

type IDrawCircleOptions = {
    x: number;
    y: number;
    rx: number;
    ry: number;
} & IDrawShapeOptions &
    IDrawIdOptions;

type IDrawArcOptions = {
    cx: number;
    cy: number;
    radius: number;
    startAngle: number;
    endAngle: number;
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
    drawArc: (options: IDrawArcOptions) => string;
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

function setOptionalAttribute(
    element: Element,
    attribute: string,
    value: any,
    condition?: boolean,
) {
    if (condition !== undefined ? condition : !!value) {
        element.setAttribute(attribute, value.toString());
    } else {
        element.removeAttribute(attribute);
    }
}

function setCommonOptions(element: Element, options: IDrawShapeOptions) {
    const { fill, stroke, strokeWidth, strokeDashArray } = options;
    setOptionalAttribute(element, 'fill', fill);
    setOptionalAttribute(element, 'stroke', stroke);
    setOptionalAttribute(element, 'stroke-width', strokeWidth);
    setOptionalAttribute(element, 'stroke-dasharray', strokeDashArray);
}

function setLineOptions(line: Element, options: IDrawLineOptions) {
    setCommonOptions(line, options);
    const { x1, x2, y1, y2, stroke = '#000', angle, rx, ry } = options;
    const cx = (x2 - x1) / 2;
    const cy = (y2 - y1) / 2;
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    setOptionalAttribute(line, 'transform', `rotate(${angle}, ${rx ?? cx}, ${ry ?? cy})`, !!angle);
    line.setAttribute('stroke', stroke);
}

function setRectOptions(rect: Element, options: IDrawRectOptions) {
    const { cx, cy, width, height, angle, rx, ry } = options;
    rect.setAttribute('x', (cx - width / 2).toString());
    rect.setAttribute('y', (cy - height / 2).toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    setOptionalAttribute(rect, 'transform', `rotate(${angle}, ${rx ?? cx}, ${ry ?? cy})`, !!angle);
    setCommonOptions(rect, options);
}

function setCircleOptions(ellipse: Element, options: IDrawCircleOptions) {
    setCommonOptions(ellipse, options);
    const { x, y, rx, ry } = options;
    ellipse.setAttribute('cx', x.toString());
    ellipse.setAttribute('cy', y.toString());
    ellipse.setAttribute('rx', rx.toString());
    ellipse.setAttribute('ry', ry.toString());
}

function setArcOptions(arc: Element, options: IDrawArcOptions) {
    setCommonOptions(arc, options);
    const { cx, cy, radius, startAngle, endAngle, angle, rx, ry } = options;
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const data = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
    arc.setAttribute('d', data.join(' '));
    setOptionalAttribute(arc, 'transform', `rotate(${angle}, ${rx ?? cx}, ${ry ?? cy})`, !!angle);
}

function setTextOptions(element: Element, options: IDrawTextOptions) {
    setCommonOptions(element, options);
    const { x, y, angle = 0, rx, ry, fontSize = 14, text } = options;
    element.setAttribute('x', x.toString());
    element.setAttribute('y', (y + 6).toString());
    element.setAttribute('style', `text-anchor: middle; font-size: ${fontSize}px`);
    element.setAttribute('transform', `rotate(${angle}, ${rx ?? x}, ${ry ?? y})`);
    element.textContent = text;
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
        function handleResize() {
            const svg = svgRef.current;
            const parent = svg?.parentElement;
            if (!svg || !parent) return;
            const { width, height } = parent!.getBoundingClientRect();
            svg.setAttribute('viewBox', `0 0 ${width * scale} ${height * scale}`);
            svg.setAttribute('version', '1.1');
            svg.setAttribute('xmlns', SVG_NS);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        drawArc: (options) => {
            const { element, id } = findOrCreate(
                svgRef.current,
                options.id,
                'path',
                options.groupId,
            );
            setArcOptions(element, options);
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
