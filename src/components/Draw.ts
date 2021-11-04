import { IDrawing } from '../hooks/useDrawing';
import { distanceBetween, getAngle, GuideLine } from './Geometry';
import { Line, Point, Wall } from './GlobalContext';

export type DrawEvent = { x: number; y: number; id: number };

export type DrawPoint = Point & {
    pressure?: number;
    color?: string;
};

type Context = IDrawing;

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

export const wallPointSize = 12;
export const wallCircleRadius = 16;

export const wallGroupId = (wall: Line) => `w${wall.id}`;
export const pointGroupId = (point: Point) => `p${point.editId}`;

export function drawWallStart(ctx: Context, wall: Line) {
    ctx.drawRect({
        id: `w${wall.id}s`,
        groupId: wallGroupId(wall),
        cx: wall.p1.x,
        cy: wall.p1.y,
        width: wallPointSize,
        height: wallPointSize,
        strokeWidth: 1,
        stroke: '#000',
        fill: '#bbb',
    });
}
export function drawWallEnd(ctx: Context, wall: Line) {
    ctx.drawRect({
        id: `w${wall.id}e`,
        groupId: wallGroupId(wall),
        cx: wall.p2.x,
        cy: wall.p2.y,
        width: wallPointSize,
        height: wallPointSize,
        strokeWidth: 1,
        stroke: '#000',
        fill: '#bbb',
    });
}

export function drawWall(ctx: Context, wall: Wall, color = '#000') {
    const groupId = ctx.createGroup(wallGroupId(wall), 'walls');
    const bodyId = ctx.createGroup(`${groupId}.body`, groupId);
    // drawCircle(ctx, `w${wall.id}c1`, groupId, wall.p1.x, wall.p1.y, wallCircleRadius, 'none', '#000');
    // drawCircle(ctx, `w${wall.id}c2`, groupId, wall.p2.x, wall.p2.y, wallCircleRadius, 'none', '#000');
    if (wall.type === 'wall' || wall.type === 'window' || !wall.type) {
        ctx.drawRect({
            groupId: bodyId,
            id: `w${wall.id}r`,
            cx: (wall.p1.x + wall.p2.x) / 2,
            cy: (wall.p1.y + wall.p2.y) / 2,
            angle: getAngle(wall.p1, wall.p2),
            width: distanceBetween(wall.p1, wall.p2),
            height: wall.type === 'window' ? wallPointSize / 2 : wallPointSize,
            strokeWidth: 1,
            stroke: color,
            fill: wall.type === 'window' ? 'none' : '#ccc',
        });
        ctx.removeElement(`w${wall.id}l`, bodyId);
        ctx.removeElement(`w${wall.id}d`, bodyId);
        ctx.removeElement(`w${wall.id}a`, bodyId);
    } else {
        ctx.drawLine({
            groupId: bodyId,
            id: `w${wall.id}l`,
            x1: wall.p1.x,
            y1: wall.p1.y,
            x2: wall.p2.x,
            y2: wall.p2.y,
            stroke: color,
            strokeDashArray: '3 3',
        });
        if (wall.type === 'door') {
            const variant = parseInt(wall.variant ?? '1') || 1;
            const inside = variant === 1 || variant === 3;
            const rightOpen = variant === 1 || variant === 2;
            ctx.drawLine({
                groupId: bodyId,
                id: `w${wall.id}d`,
                x1: wall.p1.x,
                y1: wall.p1.y,
                x2: wall.p2.x,
                y2: wall.p2.y,
                stroke: color,
                angle: inside ? -45 : 45,
                rx: rightOpen ? wall.p2.x : wall.p1.x,
                ry: rightOpen ? wall.p2.y : wall.p1.y,
            });
            const startAngle = (rightOpen ? 180 : 0) + 45 + (variant % 2 === 0 ? 45 : 0);
            ctx.drawArc({
                groupId: bodyId,
                id: `w${wall.id}a`,
                cx: rightOpen ? wall.p2.x : wall.p1.x,
                cy: rightOpen ? wall.p2.y : wall.p1.y,
                strokeWidth: 1,
                startAngle: startAngle,
                endAngle: startAngle + 45,
                angle: getAngle(wall.p1, wall.p2),
                radius: distanceBetween(wall.p1, wall.p2),
                strokeDashArray: '5 5',
                stroke: color,
                fill: 'none',
            });
        } else {
            ctx.removeElement(`w${wall.id}d`, bodyId);
            ctx.removeElement(`w${wall.id}a`, bodyId);
        }
        ctx.removeElement(`w${wall.id}r`, bodyId);
    }
    if (!wall.type || wall.type === 'wall' || wall.type === 'door') {
        drawWallStart(ctx, wall);
        drawWallEnd(ctx, wall);
    } else {
        ctx.removeElement(`w${wall.id}s`, groupId);
        ctx.removeElement(`w${wall.id}e`, groupId);
    }
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
            x: cx - 20 * Math.sin(alpha),
            y: cy - 20 * Math.cos(alpha),
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
            x: cx + 20 * Math.sin(alpha),
            y: cy + 22 * Math.cos(alpha),
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
