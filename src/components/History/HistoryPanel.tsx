import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { ReactComponent as TrashIcon } from '../../assets/icons/delete.svg';
import { ReactComponent as RedoIcon } from '../../assets/icons/redo.svg';
import { ReactComponent as UndoIcon } from '../../assets/icons/undo.svg';
import { erasePlan, savePlan, useGlobalContext } from '../GlobalContext';
import { RoundButton } from '../RoundButton/RoundButton';
import './HistoryPanel.css';

export const HistoryPanel: React.FC = () => {
    const { drawing, commandsHistory, control } = useGlobalContext();
    const plan = useWatch({ control, name: 'plan' });

    const clear = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Are you sure want to delete all?')) {
            commandsHistory.clear();
            erasePlan(drawing, plan);
            plan.walls = [];
            plan.notes = [];
            savePlan(plan);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.code === 'KeyZ') {
                    commandsHistory.undo();
                } else if (e.code === 'KeyY') {
                    commandsHistory.redo();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [commandsHistory]);

    return (
        <div className="historyPanel">
            <RoundButton title="Undo" onClick={commandsHistory.undo} icon={<UndoIcon />} />
            <RoundButton title="Redo" onClick={commandsHistory.redo} icon={<RedoIcon />} />
            <RoundButton title="Clear" onClick={clear} icon={<TrashIcon />} />
        </div>
    );
};
