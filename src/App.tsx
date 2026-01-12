import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useAppSelector } from "./box/hooks";
import { darkTheme, lightTheme } from "./theme";
import Layout from "./components/Layout/Layout";
import { routes } from "./box/routes";
import YandexMetrica from "./components/YandexMetrica/YandexMetrica";

const App: React.FC = () => {
  const isDarkMode = useAppSelector(state => state.rootReducer.isDarkMode)
  const theme = isDarkMode ? darkTheme : lightTheme
  const basename = process.env.NODE_ENV === 'production' ? '/tax-georgia' : '/'

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename={basename}>
          <YandexMetrica />
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.name}
                path={route.path}
                element={<Layout children={<route.component />} />}
              />
            ))}
          </Routes>
        </Router>
      </ThemeProvider>
  );
};

export default App;
