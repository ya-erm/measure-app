import React from 'react';
import './App.css';
import { FileActions } from './components/FileActions/FileActions';
import { GlobalContext, useGlobalState } from './components/GlobalContext';
import { HistoryPanel } from './components/History/HistoryPanel';
import PreventTouch from './components/PreventTouch';
import { Settings } from './components/Settings/Settings';
import { CursorTool } from './components/Tools/CursorTool';
import { DestroyTool } from './components/Tools/DestroyTool';
import { PenTool } from './components/Tools/PenTool';
import { Toolbox } from './components/Tools/Toolbox';
import { WallTool } from './components/Tools/WallTool';

function App() {
    const globalContext = useGlobalState();
    const { interactiveRef, drawingRef } = globalContext;

    return (
        <GlobalContext.Provider value={globalContext}>
            <main>
                <PreventTouch />
                <WallTool />
                <CursorTool />
                <PenTool />
                <DestroyTool />
                <div ref={interactiveRef} className="paper main">
                    <svg ref={drawingRef} style={{ width: '100%', height: '100%' }}>
                        <g id="pen" />
                        <g id="guide" />
                        <g id="walls" />
                    </svg>
                </div>
                <Toolbox />
                <div className="rightMenu">
                    <Settings />
                    <FileActions />
                    <ol style={{ paddingInlineStart: 15, margin: 0 }}>
                        <b>What need to do</b>
                        <li>hotkeys to undo</li>
                        <li>handle resize</li>
                        <li>pen color, width</li>
                        <li>wall length text</li>
                        <li>door, window</li>
                        <li>app icon</li>
                        <li>translate app</li>
                        <li>custom zoom</li>
                    </ol>
                </div>
                <HistoryPanel />
            </main>
        </GlobalContext.Provider>
    );
}

export default App;
