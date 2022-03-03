import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        themeTitle: string,
        colors: {
            header: string,
            headerBorderBottom: string,
            body: string,
            main: string,
            bodyColor: string,
            spanColor: string,
        }
    }
}