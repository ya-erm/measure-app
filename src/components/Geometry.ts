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
