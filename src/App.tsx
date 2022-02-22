import { Home } from "./Pages/Home";
import { NewRoom } from "./Pages/NewRoom";
import { BrowserRouter, Route, Routes } from 'react-router-dom'; //Criar rotas entre as telas
import { AuthContextProvider } from './contexts/AuthContext'
import { Room } from "./Pages/Room";

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/rooms/new" element={<NewRoom />}/>
          <Route path="/rooms/:id" element={<Room />}/>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
