import { ThemeContext } from './theme-context';
import React from 'react';

export default class ThemedButton extends React.Component<{}> {
    static contextType = ThemeContext;
    context!: React.ContextType<typeof ThemeContext>
    render() {
        return (
            <ThemeContext.Consumer>
                {({theme, changeTheme}) => (
                    <button onClick={changeTheme} style={{backgroundColor: JSON.stringify(theme)}}>Toggle Theme</button>
                )}
            </ThemeContext.Consumer>
        );
    }
}
