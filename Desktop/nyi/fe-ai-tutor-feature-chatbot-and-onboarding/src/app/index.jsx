import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { ThemeContextProvider } from '../theme/ThemeContext';
import Routes from '../routes';
import { ToastProvider } from '../components/Toasts/ToastContext';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import baseTheme from '../theme';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeContextProvider>
          <ThemeProvider theme={baseTheme}>
            <CssBaseline />
            <ToastProvider>
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </ToastProvider>
          </ThemeProvider>
        </ThemeContextProvider>
      </PersistGate>
    </Provider>
  );
};

export default App; 