import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./shared/home";
import { DelegadosRutas } from "../src/routes/delegadosRutas";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {DelegadosRutas()}
    </Routes>
  );
}

export default App;
