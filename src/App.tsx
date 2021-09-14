import React, { useEffect, useRef } from 'react';
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
    const { globalState, updateGlobalState } = globalContext;
    const { scale, pointerDown } = globalState;

    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    useEffect(() => {
        const canvas = canvasRef.current!;
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
        const context = canvas.getContext('2d')!;
        updateGlobalState({ canvas, context });
    }, [scale, updateGlobalState]);

    return (
        <GlobalContext.Provider value={globalContext}>
            <>
                <Helmet>
                    <title>Measure App</title>
                </Helmet>
                <main>
                    <PenTool />
                    <WallTool />
                    <CursorTool />
                    <canvas ref={canvasRef} className="fullScreenCanvas" />
                    <Toolbox />
                    <Settings />
                </main>
            </>
        </GlobalContext.Provider>
    );
}

export default App;
