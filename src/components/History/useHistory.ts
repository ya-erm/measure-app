import { useMemo } from 'react';
import { IDrawing, IDrawPathOptions } from '../../hooks/useDrawing';
import { drawWall, wallGroupId } from '../Draw';
import { IPlan, Line, savePlan } from '../GlobalContext';

export type IHistory = {
    add: (record: IHistoryRecord) => void;
    undo: () => void;
    redo: () => void;
};

export type IHistoryRecord =
    | {
          tool: 'wall';
          data: {
              addedWall: Line;
          };
      }
    | {
          tool: 'cursor';
          data: {
              before: Line[];
              after: Line[];
          };
      }
    | {
          tool: 'pencil' | 'eraser';
          data: {
              options: IDrawPathOptions;
          };
      };

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
                        if (options.id) drawing.removeElement(options.id);
                        break;
                }
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
                                });
                            drawWall(drawing, wall);
                        });
                        break;
                    case 'pencil':
                    case 'eraser':
                        const { options } = item.data;
                        drawing.drawPath(options);
                        break;
                }
            },
        }),
        [plan, drawing],
    );
    return history;
}
