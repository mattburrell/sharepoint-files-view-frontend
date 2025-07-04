import "./App.css";
import { Route, Routes } from "react-router-dom";
import MicrosoftCallback from "./components/MicrosoftCallback";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
