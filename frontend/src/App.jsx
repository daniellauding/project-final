import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import VotePoll from "./pages/VotePoll";
import Results from "./pages/Results";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:shareId" element={<VotePoll />} />
          <Route path="/poll/:shareId/results" element={<Results />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
