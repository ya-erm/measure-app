import { ReactComponent as TrashIcon } from '../../assets/icons/delete.svg';
import { ReactComponent as RedoIcon } from '../../assets/icons/redo.svg';
import { ReactComponent as UndoIcon } from '../../assets/icons/undo.svg';
import { IDrawing } from '../../hooks/useDrawing';
import { wallGroupId } from '../Draw';
import { IPlan, savePlan } from '../GlobalContext';
import { RoundButton } from '../RoundButton/RoundButton';
import './HistoryPanel.css';
import { IHistory } from './useHistory';

type IHistoryPanelProps = {
    history: IHistory;

    drawing: IDrawing;
    plan: IPlan;
};

export const HistoryPanel: React.FC<IHistoryPanelProps> = ({ history, drawing, plan }) => {
    const clear = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Are you sure want to delete all?')) {
            plan.walls.forEach((w) => drawing.removeElement(wallGroupId(w)));
            plan.walls = [];
            savePlan(plan);
        }
    };
    return (
        <div className="historyPanel">
            <RoundButton title="Undo" onClick={history.undo} icon={<UndoIcon />} />
            <RoundButton title="Redo" onClick={history.redo} icon={<RedoIcon />} />
            <RoundButton title="Clear" onClick={clear} icon={<TrashIcon />} />
        </div>
    );
};
