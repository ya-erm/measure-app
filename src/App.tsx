import React, { useEffect } from 'react';
import './App.css';
import { GlobalContext, useGlobalState } from './components/GlobalContext';
import { HistoryPanel } from './components/History/HistoryPanel';
import { MiniKeyboard } from './components/Keyboard/Keyboard';
import PreventTouch from './components/PreventTouch';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { CursorTool } from './components/Tools/CursorTool';
import { DestroyTool } from './components/Tools/DestroyTool';
import { HistoryTool } from './components/Tools/HistoryTool';
import { MoveTool } from './components/Tools/MoveTool';
import { PenTool } from './components/Tools/PenTool';
import { Toolbox } from './components/Tools/Toolbox';
import { WallTool } from './components/Tools/WallTool';

function App() {
    const globalContext = useGlobalState();
    const { interactiveRef, drawingRef } = globalContext;
    console.log('App render');

    useEffect(() => {
        window.addEventListener('resize', () => {});
    }, []);

    return (
        <GlobalContext.Provider value={globalContext}>
            <main className="unselectable">
                <PreventTouch />
                <HistoryTool />
                <WallTool />
                <CursorTool />
                <PenTool />
                <DestroyTool />
                <MoveTool />
                <div ref={interactiveRef} className="paper main">
                    <svg ref={drawingRef}>
                        <g id="pen" />
                        <g id="guide" />
                        <g id="walls" />
                    </svg>
                </div>
                <Toolbox />
                <SettingsPanel />
                <MiniKeyboard />
                <HistoryPanel />
            </main>
        </GlobalContext.Provider>
    );
}

export default App;
