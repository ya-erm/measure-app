import React, { useCallback } from 'react';
import { downloadFile, saveSvg, uploadFile } from '../../utils/svg/save';
import { drawWall } from '../Draw';
import { useGlobalContext } from '../GlobalContext';
import './FileActions.css';

type IFileActionsProps = {};

export const FileActions: React.FC<IFileActionsProps> = () => {
    const { drawing, drawingRef, globalState } = useGlobalContext();
    const exportSvg = useCallback(() => saveSvg(drawingRef.current!), [drawingRef]);

    const saveJson = useCallback(() => {
        const json = JSON.stringify(globalState.plan);
        downloadFile(json, `Plan ${new Date().toLocaleDateString()}.json`, 'text/plain');
    }, [globalState.plan]);

    const loadJson = useCallback(() => {
        uploadFile((json) => {
            try {
                if (!json) return;
                const plan = JSON.parse(json);
                console.log('Loaded plan', plan);
                globalState.plan = plan;
                globalState.plan.walls.forEach((w) => drawWall(drawing, w));
            } catch {
                console.log('Failed to load plan');
            }
        });
    }, [drawing, globalState]);

    return (
        <div className="fileActionsContainer">
            <button onClick={exportSvg}>Save SVG</button>
            <button onClick={saveJson}>Save JSON</button>
            <button onClick={loadJson}>Load JSON</button>
        </div>
    );
};
