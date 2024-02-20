import "./App.css";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Setup from "./pages/Setup";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/Setup" element={<Setup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
