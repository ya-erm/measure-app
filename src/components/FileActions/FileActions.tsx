import React, { useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import { ReactComponent as ExportIcon } from '../../assets/icons/export.svg';
import { ReactComponent as OpenIcon } from '../../assets/icons/folder-o.svg';
import { ReactComponent as SaveIcon } from '../../assets/icons/save.svg';
import { downloadFile, saveSvg, uploadFile } from '../../utils/svg/save';
import { drawPlan, erasePlan, IPlan, savePlan, useGlobalContext } from '../GlobalContext';
import { RoundButton } from '../RoundButton/RoundButton';
import './FileActions.css';

type IFileActionsProps = {};

export const FileActions: React.FC<IFileActionsProps> = () => {
    const { drawing, drawingRef, control } = useGlobalContext();
    const plan = useWatch({ control, name: 'plan' });

    const exportSvg = useCallback(() => saveSvg(drawingRef.current!), [drawingRef]);

    const saveJson = useCallback(() => {
        const json = JSON.stringify(plan);
        downloadFile(json, `Plan ${new Date().toLocaleDateString()}.json`, 'text/plain');
    }, [plan]);

    const loadJson = useCallback(() => {
        uploadFile((json) => {
            try {
                if (!json) return;
                erasePlan(drawing, plan);
                const parsedPlan = JSON.parse(json) as IPlan;
                console.log('Load JSON', parsedPlan);
                plan.walls = parsedPlan.walls ?? [];
                plan.notes = parsedPlan.notes ?? [];
                drawPlan(drawing, parsedPlan);
                savePlan(parsedPlan);
            } catch {
                console.log('Failed to load plan');
            }
        });
    }, [plan, drawing]);

    return (
        <div className="fileActionsContainer">
            <RoundButton icon={<OpenIcon />} onClick={loadJson} title="Open" />
            <RoundButton icon={<SaveIcon />} onClick={saveJson} title="Save" />
            <RoundButton icon={<ExportIcon />} onClick={exportSvg} title="Export" />
        </div>
    );
};
