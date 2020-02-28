import React from "react";

export const ThemeContext = React.createContext<IThemeContext>({ theme: themes.get('dark'), changeTheme: () => {}});