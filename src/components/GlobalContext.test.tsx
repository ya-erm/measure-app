import { render, screen } from '@testing-library/react';
import React from 'react';
import { GlobalContext, IGlobalContext, useGlobalContext, useGlobalState } from './GlobalContext';

export type IWithContextProps = {
    setContext?: (value: IGlobalContext) => void;
};

export const WithContext: React.FC<IWithContextProps> = ({ setContext, children }) => {
    const globalContext = useGlobalState();
    if (setContext) {
        setContext(globalContext);
    }
    return <GlobalContext.Provider value={globalContext}>{children}</GlobalContext.Provider>;
};

export function renderWithGlobalContext(element: React.ReactElement) {
    let context: IGlobalContext | null;
    render(<WithContext setContext={(value) => (context = value)}>{element}</WithContext>);
    return context!;
}

const ContextConsumer: React.FC = () => {
    const context = useGlobalContext();
    return <div>{context ? 'Ok' : 'Error'}</div>;
};

test('Global context can be used from child components within provider', () => {
    render(
        <WithContext>
            <ContextConsumer />
        </WithContext>,
    );
    const element = screen.getByText(/OK/i);
    expect(element).toBeInTheDocument();
});
