import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Countries from './components/Countries';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#880e4f',
    },
    secondary: {
      main: '#64b5f6',
    },
    error: {
      main: '#e53935',
      contrastText: '#ffcdd2',
    },
    warning: {
      main: '#bf360c',
    },
    info: {
      main: '#18ffff',
    },
    divider: '#f8bbd0',
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: 'Lora',
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Countries></Countries>
      </div>
    </ThemeProvider>
  );
}

export default App;
