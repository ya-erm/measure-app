import React, { useState } from 'react';
import { FileActions } from '../FileActions/FileActions';
import { RoundButton } from '../RoundButton/RoundButton';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg';
import { Settings } from './Settings';
import { TodoList } from './TodoList';
import clsx from 'clsx';

export const SettingsPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="settingsPanel">
            <div className="settingsPanelButtons">
                <FileActions />
                <RoundButton
                    active={isOpen}
                    title="Settings"
                    icon={<SettingsIcon />}
                    onClick={() => setIsOpen((prev) => !prev)}
                />
            </div>
            <div className={clsx('settingsContainer', !isOpen && 'settingsContainerHidden')}>
                <div className="settingsPage">
                    <Settings />
                    <TodoList />
                </div>
            </div>
        </div>
    );
};
