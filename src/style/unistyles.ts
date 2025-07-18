import { UnistylesRegistry } from 'react-native-unistyles';

type AppBreakpoints = {
    xs: 0;
    sm: 576;
    md: 768;
    lg: 992;
    xl: 1200;
};

type AppThemes = {
    light: typeof lightTheme;
    dark: typeof darkTheme;
};

const lightTheme = {
    colors: {
        accent: '#45B7D1', // optional custom
        bgDark: '#f0e6f2',
        bg: '#f6eef7',
        bgLight: '#ffffff',
        text: '#37072c',
        textMuted: '#84426f',
        highlight: '#ffe9f8',
        border: '#b16b99',
        borderMuted: '#c88aae',
        primary: '#864174',
        secondary: '#588b44',
        danger: '#c26b49',
        warning: '#c1bb4b',
        success: '#4fbd5c',
        info: '#7756c3',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        round: 50,
    },
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },
    fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 8,
        },
    },
};

const darkTheme = {
    ...lightTheme,
    colors: {
        ...lightTheme.colors,
        bgDark: '#1A1118',
        bg: '#1F151C',
        bgLight: '#241922',
        text: '#F3E9F1',
        textMuted: '#B98DB3',
        highlight: '#FFEAF9',
        border: '#AD6694',
        borderMuted: '#C38CB0',
        primary: '#D77AB8',
        secondary: '#93D777',
        danger: '#DD9579',
        warning: '#DFD976',
        success: '#6FDA7E',
        info: '#9B89E0',
    },
};

const breakpoints: AppBreakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
};

UnistylesRegistry
    .addBreakpoints(breakpoints)
    .addThemes({
        light: lightTheme,
        dark: darkTheme,
    })
    .addConfig({
        adaptiveThemes: true,
    });

declare module 'react-native-unistyles' {
    export interface UnistylesBreakpoints extends AppBreakpoints {}
    export interface UnistylesThemes extends AppThemes {}
}

