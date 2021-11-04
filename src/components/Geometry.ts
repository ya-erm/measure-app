import { Line, Point } from './GlobalContext';

export type WallOrientation = 'horizontal' | 'vertical';

export function getWallOrientation({ p1, p2 }: { p1: Point; p2: Point }): WallOrientation {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    if (Math.abs(dx) > Math.abs(dy)) {
        return 'horizontal';
    }
    return 'vertical';
}

export function getAngle(p1: Point, p2: Point) {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    let degrees;
    if (x2 === x1) {
        degrees = y2 > y1 ? 90 : 270;
    } else if (y2 === y1) {
        degrees = x2 > x1 ? 0 : 180;
    } else {
        const riseOverRun = (y2 - y1) / (x2 - x1);
        const radians = Math.atan(riseOverRun);
        degrees = radians * (180 / Math.PI);

        if (x2 - x1 < 0 || y2 - y1 < 0) degrees += 180;
        if (x2 - x1 > 0 && y2 - y1 < 0) degrees -= 180;
        if (degrees < 0) degrees += 360;
    }
    return degrees;
}

export function distanceBetween(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

export const guideLineMagnetSize = 20;

export type GuideLine = {
    wall: Line;
    point: Point;
};

export function findAlignedGuideLines(walls: Line[], wall: Line): GuideLine[] {
    const orientation = getWallOrientation(wall);
    const guidLines: GuideLine[] = [];
    walls.forEach((w) => {
        if (wall === w) return;
        const other = w.p1.x === w.p2.x ? 'vertical' : w.p1.y === w.p2.y ? 'horizontal' : 'other';
        if (orientation === 'horizontal' && other === 'horizontal') {
            if (Math.abs(wall.p2.x - w.p1.x) < guideLineMagnetSize) {
                wall.p2.x = w.p1.x;
                guidLines.push({ wall: w, point: w.p1 });
            } else if (Math.abs(wall.p2.x - w.p2.x) < guideLineMagnetSize) {
                wall.p2.x = w.p2.x;
                guidLines.push({ wall: w, point: w.p2 });
            }
        } else if (orientation === 'vertical' && other === 'vertical') {
            if (Math.abs(wall.p2.y - w.p1.y) < guideLineMagnetSize) {
                wall.p2.y = w.p1.y;
                guidLines.push({ wall: w, point: w.p1 });
            } else if (Math.abs(wall.p2.y - w.p2.y) < guideLineMagnetSize) {
                wall.p2.y = w.p2.y;
                guidLines.push({ wall: w, point: w.p2 });
            }
        }
    });
    return guidLines;
}

export function findAllGuideLines(walls: Line[], points: Point[], point: Point): GuideLine[] {
    const guidLines: GuideLine[] = [];
    walls.forEach((w) => {
        if (Math.abs(w.p1.x - point.x) < guideLineMagnetSize) {
            guidLines.push({ wall: w, point: w.p1 });
            points.forEach((p) => {
                p.x = w.p1.x;
            });
        }
        if (Math.abs(w.p1.y - point.y) < guideLineMagnetSize) {
            guidLines.push({ wall: w, point: w.p1 });
            points.forEach((p) => {
                p.y = w.p1.y;
            });
        }

        if (Math.abs(w.p2.x - point.x) < guideLineMagnetSize) {
            guidLines.push({ wall: w, point: w.p2 });
            points.forEach((p) => {
                p.x = w.p2.x;
            });
        }
        if (Math.abs(w.p2.y - point.y) < guideLineMagnetSize) {
            guidLines.push({ wall: w, point: w.p2 });
            points.forEach((p) => {
                p.y = w.p2.y;
            });
        }
    });
    return guidLines;
}

function inRange(x: number, x1: number, x2: number) {
    return Math.min(x1, x2) <= x && x <= Math.max(x1, x2);
}

export function crossLines(l1: Line, l2: Line, onLine: boolean = false) {
    const x1 = l1.p1.x;
    const y1 = l1.p1.y;
    const x2 = l1.p2.x;
    const y2 = l1.p2.y;
    const x3 = l2.p1.x;
    const y3 = l2.p1.y;
    const x4 = l2.p2.x;
    const y4 = l2.p2.y;
    let n: number;
    if (y2 - y1 !== 0) {
        const q = (x2 - x1) / (y1 - y2);
        const sn = x3 - x4 + (y3 - y4) * q;
        if (!sn) {
            return null;
        }
        const fn = x3 - x1 + (y3 - y1) * q;
        n = fn / sn;
    } else {
        if (!(y3 - y4)) {
            return null;
        }
        n = (y3 - y1) / (y3 - y4);
    }
    const x = x3 + (x4 - x3) * n;
    const y = y3 + (y4 - y3) * n;

    if (onLine) {
        if (inRange(x, x1, x2) && inRange(x, x3, x4) && inRange(y, y1, y2) && inRange(y, y3, y4)) {
            return { x, y };
        }
        return null;
    }

    return { x, y };
}

export function pointProjection(p: Point, l: Line, onLine: boolean = false) {
    const x1 = l.p1.x;
    const y1 = l.p1.y;
    const x2 = l.p2.x;
    const y2 = l.p2.y;
    const x3 = p.x;
    const y3 = p.y;

    const x =
        (x1 * x1 * x3 -
            2 * x1 * x2 * x3 +
            x2 * x2 * x3 +
            x2 * (y1 - y2) * (y1 - y3) -
            x1 * (y1 - y2) * (y2 - y3)) /
        ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

    const y =
        (x2 * x2 * y1 +
            x1 * x1 * y2 +
            x2 * x3 * (y2 - y1) -
            x1 * (x3 * (y2 - y1) + x2 * (y1 + y2)) +
            (y1 - y2) * (y1 - y2) * y3) /
        ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

    if (onLine) {
        if (inRange(x, x1, x2) && inRange(y, y1, y2)) {
            return { x, y };
        }
        return null;
    }

    return { x, y };
}

export function rotateVector(v: { x: number; y: number }, angle: number) {
    const cs = Math.cos(angle);
    const sn = Math.sin(angle);
    const rx = v.x * cs - v.y * sn;
    const ry = v.x * sn + v.y * cs;
    return { x: rx, y: ry };
}

export function normalizeVector(v: { x: number; y: number }) {
    const length = Math.sqrt(v.x * v.x + v.y * v.y);
    if (length === 0) return v;
    return { x: v.x / length, y: v.y / length };
}

export function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
    var angleInRadians = ((angle - 90) * Math.PI) / 180.0;
    return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians),
    };
}
