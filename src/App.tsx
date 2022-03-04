import { Home } from "./Pages/Home";
import { NewRoom } from "./Pages/NewRoom";
import { BrowserRouter, Route, Routes } from 'react-router-dom'; //Criar rotas entre as telas
import { AuthContextProvider } from './contexts/AuthContext'
import { Room } from "./Pages/Room";
import { AdminRoom } from "./Pages/AdminRoom";
import { ThemeProvider } from 'styled-components';
import { usePersistedState } from "./hooks/usePersistedState";

import GlobalStyle from './styles/global';
import light from './styles/themes/light';
import dark from './styles/themes/dark';

function App() {
  const [theme, setTheme] = usePersistedState('theme', light);

  const toggleTheme = () => {
    setTheme(theme.themeTitle === 'light' ? dark : light);
  };


  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/rooms/new" element={<NewRoom />}/>
            <Route path="/rooms/:id" element={<Room toggleTheme={toggleTheme}/>}/>
            <Route path="/admin/rooms/:id" element={<AdminRoom toggleTheme={toggleTheme}/>}/>
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
