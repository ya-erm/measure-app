import { IDrawing } from '../hooks/useDrawing';
import { getAngle, GuideLine } from './Geometry';
import { Line, Point, Wall } from './GlobalContext';

export type DrawEvent = { x: number; y: number; id: number };

export type DrawPoint = Point & {
    pressure?: number;
    color?: string;
};

type Context = IDrawing;

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

export const wallPointSize = 15;
export const wallCircleRadius = 20;

export const wallGroupId = (wall: Line) => `w${wall.id}`;
export const pointGroupId = (point: Point) => `p${point.editId}`;

export function drawWallStart(ctx: Context, wall: Line) {
    const gid = wallGroupId(wall);
    drawSquare(ctx, `w${wall.id}s`, gid, wall.p1.x, wall.p1.y, wallPointSize, 'green');
}
export function drawWallEnd(ctx: Context, wall: Line) {
    const gid = wallGroupId(wall);
    drawSquare(ctx, `w${wall.id}e`, gid, wall.p2.x, wall.p2.y, wallPointSize, 'green');
}

export function drawWall(ctx: Context, wall: Wall, color = '#000') {
    const gid = ctx.createGroup(wallGroupId(wall), 'walls');
    // drawCircle(ctx, `w${wall.id}c1`, gid, wall.p1.x, wall.p1.y, wallCircleRadius, 'none', '#000');
    // drawCircle(ctx, `w${wall.id}c2`, gid, wall.p2.x, wall.p2.y, wallCircleRadius, 'none', '#000');
    ctx.drawLine({
        groupId: gid,
        id: `w${wall.id}l`,
        x1: wall.p1.x,
        y1: wall.p1.y,
        x2: wall.p2.x,
        y2: wall.p2.y,
        stroke: color,
    });
    drawWallStart(ctx, wall);
    drawWallEnd(ctx, wall);
    drawLengths(ctx, wall, color);
}

function drawLengths(ctx: Context, wall: Wall, color: string) {
    const gid = wallGroupId(wall);

    const cx = (wall.p1.x + wall.p2.x) / 2;
    const cy = (wall.p1.y + wall.p2.y) / 2;
    let angle = getAngle(wall.p1, wall.p2);
    if (angle >= 90 && angle < 270) angle -= 180;
    let alpha = -(angle * Math.PI) / 180;

    if (wall.topText) {
        ctx.drawText({
            groupId: gid,
            id: `w${wall.id}t1`,
            text: `${wall.topText}`,
            x: cx - 18 * Math.sin(alpha),
            y: cy - 18 * Math.cos(alpha),
            fill: color,
            angle,
        });
    } else {
        ctx.removeElement(`w${wall.id}t1`, gid);
    }

    if (wall.bottomText) {
        ctx.drawText({
            groupId: gid,
            id: `w${wall.id}t2`,
            text: `${wall.bottomText}`,
            x: cx + 18 * Math.sin(alpha),
            y: cy + 18 * Math.cos(alpha),
            fill: color,
            angle,
        });
    } else {
        ctx.removeElement(`w${wall.id}t2`, gid);
    }
}

export function drawGuideLines(ctx: Context, point: Point, guideLines: GuideLine[]) {
    const groupId = ctx.createGroup(pointGroupId(point), 'guide');
    const guideLinesIds = guideLines.map((guideLine) => {
        const guideLineId = `p${point.editId}g${guideLine.wall.id}`;
        ctx.drawLine({
            groupId,
            id: guideLineId,
            x1: point.x,
            y1: point.y,
            x2: guideLine.point.x,
            y2: guideLine.point.y,
            strokeDashArray: '10 10',
        });
        return guideLineId;
    });
    ctx.removeElements((child) => !guideLinesIds.includes((child as Element).id), groupId);
}

export function removeGuideLines(ctx: Context, point: Point) {
    ctx.removeElement(pointGroupId(point), 'guide');
}
