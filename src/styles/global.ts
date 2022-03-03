import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background: ${props => props.theme.colors.body};
        color: ${props => props.theme.colors.bodyColor};
    }

    header {
        background: ${props => props.theme.colors.header};
        border-bottom: ${props => props.theme.colors.headerBorderBottom};
    }

    .room-title {
        color: ${props => props.theme.colors.bodyColor};
    }

    .user-info span {
        color: ${props => props.theme.colors.spanColor}
    }

    body, input, button, textarea {
        font: 400 16px 'Roboto', sans-serif;
    }
`;
