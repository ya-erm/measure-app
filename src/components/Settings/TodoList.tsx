import React from 'react';
import './TodoList.css';

export const TodoList: React.FC = () => {
    return (
        <div className="todoListPanel">
            <div className="todoListHeader">
                <h2>Todo list</h2>
            </div>
            <ol className="todoList">
                <li>custom zoom</li>
                <li>add cutter tool</li>
                <li>translate app</li>
                <li>store history</li>
                <li>keyboard fix</li>
                <li>pen color, width</li>
            </ol>
        </div>
    );
};
