import { useMemo } from 'react';
import { IDrawing, IDrawPathOptions } from '../../hooks/useDrawing';
import { drawWall, wallGroupId } from '../Draw';
import { IPlan, savePlan, Wall } from '../GlobalContext';

export type IHistory = {
    add: (record: IHistoryRecord) => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
};

export type IWallHistoryRecord = {
    tool: 'wall';
    data: {
        addedWall: Wall;
    };
};

export type ICursorHistoryRecord = {
    tool: 'cursor';
    data: {
        before: Wall[];
        after: Wall[];
    };
};

export type IPencilHistoryRecord = {
    tool: 'pencil' | 'eraser';
    data: {
        options: IDrawPathOptions;
    };
};

export type IDestroyHistoryRecord = {
    tool: 'destroy';
    data: {
        destroyedWalls: Wall[];
    };
};

export type ITextHistoryRecord = {
    tool: 'text';
    data: {
        id: string;
        before?: {
            topText?: string;
            bottomText?: string;
        };
        after?: {
            topText?: string;
            bottomText?: string;
        };
    };
};

export type IHistoryRecord =
    | IWallHistoryRecord
    | ICursorHistoryRecord
    | IPencilHistoryRecord
    | IDestroyHistoryRecord
    | ITextHistoryRecord;

let undoHistory: IHistoryRecord[] = [];
let redoHistory: IHistoryRecord[] = [];

export function useHistory(drawing: IDrawing, plan: IPlan): IHistory {
    const history: IHistory = useMemo(
        () => ({
            add: (record) => {
                undoHistory.push(record);
                redoHistory = [];
                savePlan(plan);
            },

            undo: () => {
                const item = undoHistory.pop();
                if (!item) return;
                redoHistory.push(item);
                switch (item.tool) {
                    case 'wall':
                        const { addedWall } = item?.data;
                        plan.walls = plan.walls.filter((w) => w !== addedWall);
                        drawing.removeElement(wallGroupId(addedWall));
                        break;
                    case 'cursor':
                        const { before } = item.data;
                        before.forEach((wall) => {
                            plan.walls
                                .filter((w) => w.id === wall.id)
                                .forEach((w) => {
                                    w.p1 = wall.p1;
                                    w.p2 = wall.p2;
                                });
                            drawWall(drawing, wall);
                        });
                        break;
                    case 'pencil':
                    case 'eraser':
                        const { options } = item.data;
                        if (options.id) {
                            plan.notes = plan.notes.filter((n) => n.id !== options.id);
                            drawing.removeElement(options.id);
                        }
                        break;
                    case 'destroy':
                        const { destroyedWalls } = item.data;
                        destroyedWalls.forEach((w) => {
                            plan.walls.push(w);
                            drawWall(drawing, w);
                        });
                        break;
                    case 'text': {
                        const { id, before } = item.data;
                        plan.walls
                            .filter((w) => w.id === id)
                            .forEach((w) => {
                                w.topText = before?.topText;
                                w.bottomText = before?.bottomText;
                                drawWall(drawing, w);
                            });
                        break;
                    }
                }
                savePlan(plan);
            },

            redo: () => {
                const item = redoHistory.pop();
                if (!item) return;
                undoHistory.push(item);
                switch (item.tool) {
                    case 'wall':
                        const { addedWall } = item?.data;
                        plan.walls.push(addedWall);
                        drawWall(drawing, addedWall);
                        break;
                    case 'cursor':
                        const { after } = item.data;
                        after.forEach((wall) => {
                            plan.walls
                                .filter((w) => w.id === wall.id)
                                .forEach((w) => {
                                    w.p1 = wall.p1;
                                    w.p2 = wall.p2;
                                    drawWall(drawing, w);
                                });
                        });
                        break;
                    case 'pencil':
                    case 'eraser':
                        const { options } = item.data;
                        plan.notes.push(options);
                        drawing.drawPath(options);
                        break;
                    case 'destroy':
                        const { destroyedWalls } = item.data;
                        destroyedWalls.forEach((w) => drawing.removeElement(wallGroupId(w)));
                        plan.walls = plan.walls.filter((w) => !destroyedWalls.includes(w));
                        break;
                    case 'text': {
                        const { id, after } = item.data;
                        plan.walls
                            .filter((w) => w.id === id)
                            .forEach((w) => {
                                w.topText = after?.topText;
                                w.bottomText = after?.bottomText;
                                drawWall(drawing, w);
                            });
                        break;
                    }
                }
                savePlan(plan);
            },

            clear: () => {
                undoHistory = [];
                redoHistory = [];
            },
        }),
        [plan, drawing],
    );
    return history;
}
