import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { saveSettings, useGlobalContext } from '../GlobalContext';
import './Settings.css';

export const Settings: React.FC = () => {
    const { control, setValue } = useGlobalContext();
    const settings = useWatch({ control, name: 'settings' });
    const { stylusMode, magneticMode, wallAlignmentMode } = settings;

    useEffect(() => {
        saveSettings(settings);
    }, [settings]);

    return (
        <div className="settingsList">
            <div className="settingsHeader">
                <h2>Settings</h2>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={stylusMode ?? false}
                        onChange={(e) => setValue('settings.stylusMode', e.target.checked)}
                    />
                    Stylus mode
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={wallAlignmentMode ?? false}
                        onChange={(e) => setValue('settings.wallAlignmentMode', e.target.checked)}
                    />
                    Walls alignment
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={magneticMode ?? false}
                        onChange={(e) => setValue('settings.magneticMode', e.target.checked)}
                    />
                    Magnet mode
                </label>
            </div>
        </div>
    );
};
