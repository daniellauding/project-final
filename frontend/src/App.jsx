import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { posthog } from "./lib/analytics";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import VotePoll from "./pages/VotePoll";
import Results from "./pages/Results";
import EditPoll from "./pages/EditPoll";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Explore from "./pages/Explore";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import Teams from "./pages/Teams";

const AppRoutes = () => {
  const location = useLocation();
  const bgLocation = location.state?.backgroundLocation;

  // Scroll to top + track pageview on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    posthog.capture("$pageview");
  }, [location.pathname]);

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
          <Route path="/explore" element={<Explore />} />
          <Route path="/create/:step?" element={<CreatePoll />} />
          <Route path="/poll/:shareId" element={<VotePoll />} />
          <Route path="/poll/:shareId/option/:optionNum" element={<VotePoll />} />
          <Route path="/poll/:shareId/results" element={<Results />} />
          <Route path="/poll/:shareId/edit" element={<EditPoll />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/welcome" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<Teams />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
      <CookieConsent />

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
  // Prevent browser from restoring scroll on navigation
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

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
