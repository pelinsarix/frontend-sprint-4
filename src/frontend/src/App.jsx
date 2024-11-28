import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Pacientes from './pages/Pacientes.jsx';
import NavBar from './components/NavBar.jsx';
import Perfil from './pages/Perfil.jsx';
import Paciente from './pages/Paciente.jsx';
import Exercicio from './pages/Exercicio.jsx';
import IDE from './pages/IDE.jsx';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/paciente/:id" element={<Paciente />} />
        <Route path="/ide" element={<IDE />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/exercicio/:id" element={<Exercicio />} />
      </Routes>
    </Router>
  );
}

export default App;
