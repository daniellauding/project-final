import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import VotePoll from "./pages/VotePoll";
import Results from "./pages/Results";
import EditPoll from "./pages/EditPoll";
import Profile from "./pages/Profile";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">
          Hoppa till innehåll
        </a>
        <Header />
        <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:shareId" element={<VotePoll />} />
          <Route path="/poll/:shareId/results" element={<Results />} />
          <Route path="/poll/:shareId/edit" element={<EditPoll />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </main>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};
