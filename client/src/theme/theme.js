// src/theme/theme.js
import { createTheme as createMuiTheme } from '@mui/material/styles';
import { extendTheme as extendJoyTheme } from '@mui/joy/styles';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    // Other MUI Core customizations
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Other typography settings
  },
});

const joyTheme = extendJoyTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    // Other Joy UI customizations
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Other typography settings
  },
});

export { muiTheme, joyTheme };
