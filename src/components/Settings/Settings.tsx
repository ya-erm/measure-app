import React from 'react';
import { useGlobalContext } from '../GlobalContext';
import './Settings.css';

export const Settings: React.FC = () => {
    const {
        globalState: { stylusMode, magneticMode, wallAlignmentMode },
        updateGlobalState,
    } = useGlobalContext();
    return (
        <div className="settingsList">
            <div>
                <b>Settings</b>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={stylusMode ?? false}
                        onChange={(e) => updateGlobalState({ stylusMode: e.target.checked })}
                    />
                    Stylus mode
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={wallAlignmentMode ?? false}
                        onChange={(e) => updateGlobalState({ wallAlignmentMode: e.target.checked })}
                    />
                    Walls alignment
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={magneticMode ?? false}
                        onChange={(e) => updateGlobalState({ magneticMode: e.target.checked })}
                    />
                    Magnet mode
                </label>
            </div>

            <a href="https://perfect-freehand-example.vercel.app/" target="_blank" rel="noreferrer">
                Perfect freehand
            </a>
        </div>
    );
};
