import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import VotePoll from "./pages/VotePoll";
import Results from "./pages/Results";
import EditPoll from "./pages/EditPoll";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Landing from "./pages/Landing";

const AppRoutes = () => {
  const location = useLocation();
  const bgLocation = location.state?.backgroundLocation;

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Routes location={bgLocation || location}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create/:step?" element={<CreatePoll />} />
          <Route path="/poll/:shareId" element={<VotePoll />} />
          <Route path="/poll/:shareId/results" element={<Results />} />
          <Route path="/poll/:shareId/edit" element={<EditPoll />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/welcome" element={<Landing />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />

      {bgLocation && (
        <Routes>
          <Route path="/poll/:shareId/edit" element={<EditPoll />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      )}
    </>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
};
