import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import './App.css';
import { GlobalContext, useGlobalState } from './components/GlobalContext';
import { Settings } from './components/Settings/Settings';
import { CursorTool } from './components/Tools/CursorTool';
import { PenTool } from './components/Tools/PenTool';
import { Toolbox } from './components/Tools/Toolbox';
import { WallTool } from './components/Tools/WallTool';

function App() {
    const globalContext = useGlobalState();
    const { drawingRef, interactiveRef, globalState } = globalContext;
    const { pointerDown } = globalState;

    useEffect(() => {
        const onTouchMove = (e: TouchEvent) => {
            if (pointerDown) {
                e.preventDefault();
            }
        };
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => {
            document.removeEventListener('touchmove', onTouchMove);
        };
    }, [pointerDown]);

    return (
        <GlobalContext.Provider value={globalContext}>
            <>
                <Helmet>
                    <title>Measure App</title>
                </Helmet>
                <main>
                    <WallTool />
                    <CursorTool />
                    <PenTool />
                    <div ref={interactiveRef} className="paper main">
                        <svg ref={drawingRef}>
                            <mask id="eraser">
                                <rect width="100%" height="100%" fill="#fff" />
                            </mask>
                            <g id="walls" />
                            <g id="pen" mask="url(#eraser)" />
                        </svg>
                    </div>
                    <Toolbox />
                    <Settings />
                </main>
            </>
        </GlobalContext.Provider>
    );
}

export default App;
