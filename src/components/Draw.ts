import { IDrawing } from '../hooks/useDrawing';
import { getAngle, GuideLine } from './Geometry';
import { Line, Point, Wall } from './GlobalContext';

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
    strokeDashArray?: string,
    stroke?: string,
) {
    ctx.drawLine({ id, groupId, x1, y1, x2, y2, strokeDashArray, stroke });
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

export function drawText(
    ctx: Context,
    id: string | undefined,
    groupId: string | undefined,
    xc: number,
    yc: number,
    text: string,
    angle: number = 0,
) {
    ctx.drawText({ id, groupId, x: xc, y: yc, angle, text });
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
    drawSquare(ctx, `w${wall.id}e`, gid, wall.p2.x, wall.p2.y, wallPointSize, 'red');
}

export function drawWall(ctx: Context, wall: Wall, color = '#000') {
    const gid = ctx.createGroup(wallGroupId(wall), 'walls');
    drawCircle(ctx, `w${wall.id}c1`, gid, wall.p1.x, wall.p1.y, wallCircleRadius, 'none', '#000');
    drawCircle(ctx, `w${wall.id}c2`, gid, wall.p2.x, wall.p2.y, wallCircleRadius, 'none', '#000');
    drawLine(
        ctx,
        `w${wall.id}l`,
        gid,
        wall.p1.x,
        wall.p1.y,
        wall.p2.x,
        wall.p2.y,
        undefined,
        color,
    );
    drawWallStart(ctx, wall);
    drawWallEnd(ctx, wall);
    if (wall.length) {
        const cx = (wall.p1.x + wall.p2.x) / 2;
        const cy = (wall.p1.y + wall.p2.y) / 2;
        let angle = getAngle(wall.p1, wall.p2);
        if (angle >= 90 && angle < 270) angle -= 180;
        drawText(ctx, `w${wall.id}t`, gid, cx, cy, `${wall.length}`, angle);
    } else {
        ctx.removeElement(`w${wall.id}t`, gid);
    }
}

export function drawGuideLines(ctx: Context, point: Point, guideLines: GuideLine[]) {
    const groupId = ctx.createGroup(pointGroupId(point), 'guide');
    const guideLinesIds = guideLines.map((guideLine) => {
        const guideLineId = `p${point.editId}g${guideLine.wall.id}`;
        drawLine(
            ctx,
            guideLineId,
            groupId,
            point.x,
            point.y,
            guideLine.point.x,
            guideLine.point.y,
            '10 10',
        );
        return guideLineId;
    });
    ctx.removeElements((child) => !guideLinesIds.includes((child as Element).id), groupId);
}

export function removeGuideLines(ctx: Context, point: Point) {
    ctx.removeElement(pointGroupId(point), 'guide');
}
