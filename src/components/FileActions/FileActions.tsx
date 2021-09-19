import React, { useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import { downloadFile, saveSvg, uploadFile } from '../../utils/svg/save';
import { drawPlan, IPlan, savePlan, useGlobalContext } from '../GlobalContext';
import './FileActions.css';

type IFileActionsProps = {};

export const FileActions: React.FC<IFileActionsProps> = () => {
    const { drawing, drawingRef, control, setValue } = useGlobalContext();
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
                const parsedPlan = JSON.parse(json) as IPlan;
                console.log('Loaded plan', parsedPlan);
                setValue('plan', parsedPlan);
                drawPlan(drawing, parsedPlan);
                savePlan(parsedPlan);
            } catch {
                console.log('Failed to load plan');
            }
        });
    }, [drawing, setValue]);

    return (
        <div className="fileActionsContainer">
            <button onClick={exportSvg}>Save SVG</button>
            <button onClick={saveJson}>Save JSON</button>
            <button onClick={loadJson}>Load JSON</button>
        </div>
    );
};
