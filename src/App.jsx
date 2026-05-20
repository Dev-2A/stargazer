import { HashRouter, Routes, Route } from "react-router-dom";
import SkyPage from "./pages/SkyPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SkyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
