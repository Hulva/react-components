import React from "react";

export type Theme = {
    foreground: string,
    background: string
}

export const themes: Map<string, Theme> = new Map<string, Theme>();
themes.set('light', {
    foreground: '#000000',
    background: '#eeeeee'
}).set('dark', {
    foreground: '#ffffff',
    background: '#222222'
});

export type IThemeContext = {
    theme: Theme | undefined,
    changeTheme(): void
}

export const ThemeContext = React.createContext<IThemeContext>({ theme: themes.get('dark'), changeTheme: () => {}});
