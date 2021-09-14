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
                <label>
                    <input
                        type="checkbox"
                        checked={stylusMode ?? false}
                        onChange={(e) => updateGlobalState({ stylusMode: e.target.checked })}
                    />
                    Режим стилуса
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={wallAlignmentMode ?? false}
                        onChange={(e) => updateGlobalState({ wallAlignmentMode: e.target.checked })}
                    />
                    Ровные стены
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={magneticMode ?? false}
                        onChange={(e) => updateGlobalState({ magneticMode: e.target.checked })}
                    />
                    Привязка к стенам
                </label>
            </div>
        </div>
    );
};
