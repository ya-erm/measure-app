import { Point } from './GlobalContext';

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
