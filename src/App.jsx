import "./App.css";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Setup from "./pages/Setup";
import Continue from "./pages/Continue";
import Win from "./pages/Win";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/Setup" element={<Setup />} />
        <Route path="/continue" element={<Continue />} />
        <Route path="/win" element={<Win />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
