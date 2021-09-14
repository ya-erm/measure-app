import { Line, Point } from './GlobalContext';

export type DrawEvent = { x: number; y: number; id: number };

type Context = CanvasRenderingContext2D;

export function drawLine(ctx: Context, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export function drawSquare(ctx: Context, xc: number, yc: number, size: number, color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(xc - size / 2, yc - size / 2, size, size);
}

export function drawCircle(ctx: Context, xc: number, yc: number, radius: number) {
    ctx.beginPath();
    ctx.arc(xc, yc, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

export const wallPointSize = 10;
export const wallCircleRadius = 30;

export function drawWallStart(ctx: Context, wall: Line) {
    drawSquare(ctx, wall.p1.x, wall.p1.y, wallPointSize, 'green');
}
export function drawWallEnd(ctx: Context, wall: Line) {
    drawSquare(ctx, wall.p2.x, wall.p2.y, wallPointSize, 'red');
}

export function drawWall(ctx: Context, wall: Line) {
    drawCircle(ctx, wall.p1.x, wall.p1.y, wallCircleRadius);
    drawCircle(ctx, wall.p2.x, wall.p2.y, wallCircleRadius);
    drawLine(ctx, wall.p1.x, wall.p1.y, wall.p2.x, wall.p2.y);
    drawWallStart(ctx, wall);
    drawWallEnd(ctx, wall);
}

export type DrawPoint = Point & {
    lineWidth: number;
    color?: string;
};

export function drawStroke(ctx: Context, stroke: DrawPoint[]) {
    ctx.strokeStyle = 'black';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const l = stroke.length - 1;
    if (stroke.length >= 3) {
        const xc = (stroke[l].x + stroke[l - 1].x) / 2;
        const yc = (stroke[l].y + stroke[l - 1].y) / 2;
        ctx.lineWidth = stroke[l - 1].lineWidth;
        ctx.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xc, yc);
    } else {
        const point = stroke[l];
        ctx.lineWidth = point.lineWidth;
        if (point.color) {
            ctx.strokeStyle = point.color;
        }
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.stroke();
    }
}

export function clearCircle(ctx: Context, x: number, y: number, radius: number = 10) {
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.globalCompositeOperation = prev;
}
