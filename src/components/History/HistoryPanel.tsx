import { ReactComponent as UndoIcon } from '../../assets/icons/undo.svg';
import { IDrawing } from '../../hooks/useDrawing';
import { drawWall, wallGroupId } from '../Draw';
import { Line } from '../GlobalContext';
import './HistoryPanel.css';

export type IHistoryRecord =
    | {
          tool: 'wall' | 'cursor';
          data: Line[];
      }
    | {
          tool: 'pencil' | 'eraser';
          data: string;
      };

export let drawHistory: IHistoryRecord[] = [];

export const HistoryPanel: React.FC<{ drawing: IDrawing }> = ({ drawing }) => {
    const undo = () => {
        const item = drawHistory.pop();
        if (!item) return;
        switch (item.tool) {
            case 'wall':
                item.data.forEach((wall) => {
                    drawing.removeElement(wallGroupId(wall));
                });
                break;
            case 'cursor':
                item.data.forEach((wall) => {
                    drawWall(drawing, wall);
                });
                break;
            case 'pencil':
            case 'eraser':
                drawing.removeElement(item.data);
                break;
        }
    };
    return (
        <div className="historyPanel">
            <div className="historyPanelItem" onClick={() => undo()}>
                <UndoIcon />
            </div>
            {/* <div className="historyPanelItem" onClick={() => redo()}>
                <RedoIcon />
            </div> */}
        </div>
    );
};
