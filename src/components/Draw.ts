import { IDrawing } from '../hooks/useDrawing';
import { Line, Point } from './GlobalContext';

export type DrawEvent = { x: number; y: number; id: number };

export type DrawPoint = Point & {
    pressure?: number;
    color?: string;
};

type Context = IDrawing;

export function drawLine(
    ctx: Context,
    id: string | undefined,
    groupId: string | undefined,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
) {
    ctx.drawLine({ id, groupId, x1, y1, x2, y2 });
}
export function drawSquare(
    ctx: Context,
    id: string | undefined,
    groupId: string | undefined,
    xc: number,
    yc: number,
    size: number,
    fill?: string,
) {
    ctx.drawRect({
        id,
        groupId,
        x: xc - size / 2,
        y: yc - size / 2,
        width: size,
        height: size,
        fill,
    });
}

export function drawCircle(
    ctx: Context,
    id: string | undefined,
    groupId: string | undefined,
    xc: number,
    yc: number,
    radius: number,
    fill?: string,
    stroke?: string,
) {
    ctx.drawCircle({ id, groupId, x: xc, y: yc, rx: radius, ry: radius, fill, stroke });
}

export const wallPointSize = 10;
export const wallCircleRadius = 15;

export const wallGroupId = (wall: Line) => `w${wall.id}`;

export function drawWallStart(ctx: Context, wall: Line) {
    const gid = wallGroupId(wall);
    drawSquare(ctx, `w${wall.id}s`, gid, wall.p1.x, wall.p1.y, wallPointSize, 'green');
}
export function drawWallEnd(ctx: Context, wall: Line) {
    const gid = wallGroupId(wall);
    drawSquare(ctx, `w${wall.id}e`, gid, wall.p2.x, wall.p2.y, wallPointSize, 'red');
}

export function drawWall(ctx: Context, wall: Line) {
    const gid = ctx.createGroup(wallGroupId(wall), 'walls');
    drawCircle(ctx, `w${wall.id}c1`, gid, wall.p1.x, wall.p1.y, wallCircleRadius, 'none', '#000');
    drawCircle(ctx, `w${wall.id}c2`, gid, wall.p2.x, wall.p2.y, wallCircleRadius, 'none', '#000');
    drawLine(ctx, `w${wall.id}l`, gid, wall.p1.x, wall.p1.y, wall.p2.x, wall.p2.y);
    drawWallStart(ctx, wall);
    drawWallEnd(ctx, wall);
}
